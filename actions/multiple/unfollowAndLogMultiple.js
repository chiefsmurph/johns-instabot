const timeoutPromise = require('../../utils/timeoutPromise');
const unfollowAndLog = require('./unfollowAndLog');

const unfollowAndLogMultiple = async (handles, cookies, browser) => {
  console.log('unfollowing', handles);

  let i = 0;
  for (let username of handles) {
    try {
      await unfollowAndLog(username, cookies, browser);
      console.log('finished', ++i, 'of', handles.length);
    } catch (e) {
      console.log('unfollow error from unfollowandlogmultiple', e);
      if (e.toString().indexOf('rate-limited') !== -1) {
        console.log('detected rate-limited.  stopping unfollowall.  wait 10 minutes then trying again');
        await timeoutPromise(10 * 1000 * 60);
        console.log('starting up again');
        await unfollowAndLogMultiple(handles.splice(i), cookies, browser);
        break;
      }
    }
    await timeoutPromise(10000 + (Math.random() * 40000));
  }
};

module.exports = unfollowAndLogMultiple;
