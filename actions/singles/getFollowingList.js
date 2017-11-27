const maxFollowersAtATime = 200;

const getFollowersList = async (username, cookies, browser) => {

  let page = await browser.newPage();

  const navigateToUserPage = async () => {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);
    await page.setCookie(...cookies);
    await page.goto(url);
    page.on('console', msg => console.log('PAGE LOG:', msg));
  };

  const openFollowersModal = async () => {
    await page.click('article > header > section > ul > li:nth-child(3) > a');
    await page.waitFor(2000);
  };

  const retrieveFollowerUsers = async () => {
    return await page.evaluate(function() {
      var allLis = [].slice.call(document.querySelectorAll('[role="dialog"] ul li'));
      return allLis.map(function(li) {
        var username = li.querySelector('div > div > div > div:nth-child(1)');
        var fullname = li.querySelector('div > div > div > div:nth-child(2)');
        return {
          username: username ? username.innerText : '',
          fullname: fullname ? fullname.innerText : ''
        };
      });
    });
  };

  const scrollFollowersModal = async () => {
    return await page.evaluate(function () {

      return new Promise(function(resolve, reject) {
        var scrollDiv = document.querySelector('[role="dialog"] > div > div > div:nth-child(2)');

        // only scroll once
        var beforeHeight = scrollDiv.scrollHeight;
        scrollDiv.scrollTop = beforeHeight;
        var b4 = new Date();

        var checker = setInterval(function() {
          var now = new Date();
          if (now - b4 > 10000) {
            clearInterval(checker);
            return resolve(true);
          } else {
            var nowHeight = scrollDiv.scrollHeight;
            if (nowHeight !== beforeHeight) {
              // console.log('YES')
              clearInterval(checker);
              return setTimeout(() => resolve(false), 300 + Math.random() * 2000);
            }
          }
        }, 100);


      });

    });
  };

  const cleanUp = async () => {
    console.log('done getting followers of ' + username);
    await page.close();
  };

  const getFollowers = async (hitEnd) => {
    const currentShowingFollowers = await (async function retrieve() {
      try {
        return await retrieveFollowerUsers();
      } catch (e) {
        console.log('try again', e);
        return retrieve();
      }
    })();

    if (shouldStopScrolling(currentShowingFollowers) || hitEnd) {
      return currentShowingFollowers;
    } else {
      const hitEnd = await scrollFollowersModal();
      return await getFollowers(hitEnd);
    }
  };

  // logic

  const shouldStopScrolling = (followersArr => {
    console.log('currently looking at', followersArr.length, 'followers');
    return followersArr.length > maxFollowersAtATime;
  });

  // run
  let followers;
  try {
    console.log('getting followers of ', username);
    await navigateToUserPage();
    await openFollowersModal();
    followers = await getFollowers();
  } catch (e) {
    console.error(e, username);
    if (retrigTimes < 3) {
      console.error('error - retriggering getFollowersList', username);
      followers = await getFollowersList(username, cookies, browser, ++retrigTimes);
    }
  } finally {
    await cleanUp();
    return followers.map(obj => obj.username.trim());
  }


};

module.exports = getFollowersList;
