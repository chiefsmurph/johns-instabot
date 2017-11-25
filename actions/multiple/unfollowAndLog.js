const handleManager = require('../../modules/handleManager');
const unfollowUser = require('../singles/unfollowUser');

const getDateFormatted = require('../../utils/getDateFormatted');

const logUnfollow = async username => {
  return await handleManager.mergeAndSave(username, {
    youfollowthem: false,
    youunfollowedthemon: getDateFormatted(),
  });
};

const unfollowAndLog = async (username, cookies, browser) => {
  try {
    await unfollowUser(username, cookies, browser);
  } catch (e) {
    console.log('error', e);
  }
  await logUnfollow(username);
};

module.exports = unfollowAndLog;
