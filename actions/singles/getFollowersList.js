const newHorseman = require('../../utils/newHorseman');
const maxFollowersAtATime = 200;

const getFollowersList = async (username, cookies) => {

  const navigateToUserPage = async () => {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);
    return await horseman
          .on('consoleMessage', msg => {
            // console.log('console', msg);
          })
          .on('resourceError', err => {
            // console.log('resource', err, url);
          })
          .cookies(cookies)
          .open(url)
          .wait(4000);
  };

  const openFollowersModal = async () => {
    return await horseman
          .click('article > header > section > ul > li:nth-child(2) > a')
          .wait(2000);
  };

  const retrieveFollowerUsers = async () => {
    return await horseman
          .evaluate(function() {
            var allLis = [].slice.call(document.querySelectorAll('[role="dialog"] ul li'));
            return allLis.map(function(li) {
              var $li = $(li);
              return {
                username: $(li).find('div > div > div > div:nth-child(1)').text(),
                fullname: $(li).find('div > div > div > div:nth-child(2)').text()
              };
            });
          });
  };

  const scrollFollowersModal = async () => {
    return await horseman
          .wait(6000)
          .evaluate(function(done) {

            var scrollDiv = document.querySelector('[role="dialog"] > div > div > div:nth-child(2)');

            // only scroll once
            var beforeHeight = scrollDiv.scrollHeight;
            $(scrollDiv).scrollTop(beforeHeight);
            setTimeout(function() {
              var nowHeight = scrollDiv.scrollHeight;
              var hitEnd = (beforeHeight === nowHeight);
              done(null, hitEnd);
            }, 2000);

            // // scroll until bottom
            // var scrolls = [];
            //
            // (function scrollIt() {
            //   var beforeHeight = scrollDiv.scrollHeight;
            //   scrolls.push(beforeHeight);
            //   setTimeout(function() {
            //     var nowHeight = scrollDiv.scrollHeight;
            //     if (beforeHeight === nowHeight) {
            //       done(null, scrolls);
            //     } else {
            //       scrollIt();
            //     }
            //   }, 2000);
            //   $(scrollDiv).scrollTop(beforeHeight);
            // })();

          });
  };

  const cleanUp = async () => {
    console.log('done getting followers of ' + username);
    return await horseman.close();
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
  const horseman = newHorseman();
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
      followers = await getFollowersList(username, cookies, ++retrigTimes);
    }
  } finally {
    await cleanUp();
    return followers;
  }


};

module.exports = getFollowersList;
