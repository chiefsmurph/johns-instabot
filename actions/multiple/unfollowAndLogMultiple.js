const timeoutPromise = require('../../utils/timeoutPromise');
const unfollowAndLog = require('./unfollowAndLog');

const unfollowAndLogMultiple = async (handles, cookies, browser) => {
  console.log('unfollowing', handles);

  let i = 0;
  for (let username of handles) {
    await unfollowAndLog(username, cookies, browser);
    console.log('finished', ++i, 'of', handles.length);
    await timeoutPromise(5000 + (Math.random() * 40000));
  }
};

module.exports = unfollowAndLogMultiple;
