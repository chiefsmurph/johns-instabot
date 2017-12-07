
// actions
const unfollowAndLogMultiple = require('../multiple/unfollowAndLogMultiple');
// helpers
const getUnfollowList = require('../../helpers/getUnfollowList');
const getNumFollowing = require('../../helpers/getNumFollowing');
// settings
const settings = require('../../settings.js');

const checkForUnfollows = async (cookies, browser) => {

  const numFollowing = getNumFollowing();
  console.log('checking for unfollows, numfollowing: ', numFollowing);
  if (settings.follows.targetFollowCount < numFollowing) {
    const unfollowList = getUnfollowList();
    const numToUnfollow = Math.ceil((numFollowing - settings.follows.targetFollowCount) / 10);
    console.log('numFollowing', numFollowing, 'unfollowlistcount', unfollowList.length, 'numToUnfollow,', numToUnfollow);

    const toUnfollow = unfollowList.slice(0, numToUnfollow).map(handleObj => handleObj.username);
    await unfollowAndLogMultiple(toUnfollow, cookies, browser);
  }

  setTimeout(async () => {
    await checkForUnfollows(cookies, browser)
  }, 1000 * 60 * 15);    // every 15 minutes

};

module.exports = checkForUnfollows;
