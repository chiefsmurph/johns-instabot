const timeoutPromise = require('../../utils/timeoutPromise');
const unfollowAndLog = require('./unfollowAndLog');

const unfollowAndLogMultiple = async (handles, cookies, browser) => {
  console.log('unfollowing', handles);
  for (let username of handles) {
    await unfollowAndLog(username, cookies, browser);
    await timeoutPromise(10000);
  }
};

module.exports = unfollowAndLogMultiple;
