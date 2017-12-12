const handleManager = require('../../modules/handleManager');
const followUser = require('../singles/followUser');

const getDateFormatted = require('../../utils/getDateFormatted');

const logFollow = async username => {
  return await handleManager.mergeAndSave(username, {
    youfollowthem: true,
    youfollowedthemon: getDateFormatted(),
  });
};

const followAndLog = async (username, cookies, browser) => {
  try {
    await followUser(username, cookies, browser);
    await logFollow(username);
  } catch (e) {
    if (e.toString().indexOf('already following user') !== -1) {
      await logFollow(username);
    }
    throw e;
  }

};

module.exports = followAndLog;
