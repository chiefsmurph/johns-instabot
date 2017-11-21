const maxFollowersAtATime = 200;

const getFollowersList = async (username, cookies, browser) => {

  let page = await browser.newPage();

  const navigateToUserPage = async () => {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const openFollowersModal = async () => {
    await page.click('article > header > section > ul > li:nth-child(2) > a');
    await page.waitFor(2000);
  };

  const retrieveFollowerUsers = async () => {
    return await page.evaluate(function() {
      var allLis = [].slice.call(document.querySelectorAll('[role="dialog"] ul li'));
      return allLis.map(function(li) {
        return {
          username: li.querySelector('div > div > div > div:nth-child(1)').innerText,
          fullname: li.querySelector('div > div > div > div:nth-child(2)').innerText
        };
      });
    });
  };

  const scrollFollowersModal = async () => {
    await page.waitFor(3000)
    return await page.evaluate(function () {

      return new Promise(function(resolve, reject) {
        var scrollDiv = document.querySelector('[role="dialog"] > div > div > div:nth-child(2)');

        // only scroll once
        var beforeHeight = scrollDiv.scrollHeight;
        scrollDiv.scrollTop = beforeHeight;
        setTimeout(function() {
          var nowHeight = scrollDiv.scrollHeight;
          var hitEnd = (beforeHeight === nowHeight);
          resolve(hitEnd);
        }, 2000);
      });

    });
  };

  const cleanUp = async () => {
    console.log('done getting followers of ' + username);
    await page.close();
  };

  const getFollowers = async (hitEnd) => {
    const currentShowingFollowers = await retrieveFollowerUsers();
    if (shouldStopScrolling(currentShowingFollowers) || hitEnd) {
      return currentShowingFollowers;
    } else {
      const hitEnd = await scrollFollowersModal();
      return await getFollowers(hitEnd);
    }
  };

  // logic

  const shouldStopScrolling = (followersArr => {
    console.log('already seen?', followersArr);
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
    return followers;
  }


};

module.exports = getFollowersList;
