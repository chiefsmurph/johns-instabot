require('dotenv').config()
require('../../utils/replaceAll');

// once daily
// scan for all followers
// check for unfollows

// db
const followManager = require('../../modules/followManager');
const handleManager = require('../../modules/handleManager');
const statManager = require('../../modules/statManager');

// actions
const getFollowersList = require('../singles/getFollowersList');
const getDataForUser = require('../singles/getDataForUser');
// utils
const getDateFormatted = require('../../utils/getDateFormatted');



// helpers
const calcNewFollowers = (prevFollowers, currentFollowers) => {
  return currentFollowers.filter(username => prevFollowers.indexOf(username) === -1);
};

const calcDroppedFollowers = (prevFollowers, currentFollowers) => {
  return prevFollowers.filter(username => currentFollowers.indexOf(username) === -1);
};

const handleNewFollowers = async newFollowers => {
  for (let username of newFollowers) {
    const prevRecord = handleManager.getHandle(username);
    const alreadyInDb = !!prevRecord;
    if (alreadyInDb) console.log(username + ' is already in the db.');
    await handleManager.mergeAndSave(username, {
      followsyou: true,
      followedyouon: getDateFormatted(),
    }, !alreadyInDb);
  }
};

const handleDroppedFollowers = async droppedFollowers => {
  for (let username of droppedFollowers) {
    await handleManager.mergeAndSave(username, {
      neverfollow: true,
      unfollowedyouon: getDateFormatted(),
      followsyou: false
    });
  }
};






const daily = async (cookies, browser) => {

  // init handleManager
  await handleManager.init();
  handleManager.setPuppeteerEnv({
    browser,
    cookies
  });

  let profileData, followers, newFollowers, droppedFollowers;

  await Promise.all([
    (async () => {
      // step 5: get current stats and save them
      // console.log('getDataForUser', getDataForUser);
      profileData = await getDataForUser(process.env.INSTA_USERNAME, cookies, browser);
      console.log('prof', profileData, process.env.INSTA_USERNAME);
    })(),
    (async () => {
      // step 1: get followers
      followers = await getFollowersList(process.env.INSTA_USERNAME, cookies, browser);
      const prevFollowersData = followManager.get();
      const prevFollowers = prevFollowersData.followers || [];
      // step 2: write new followers to json
      const newFollowersData = {
        followercount: followers.length,
        followers
      };
      await followManager.set(newFollowersData);
      // step 3: calc and handle new followers
      newFollowers = calcNewFollowers(prevFollowers, followers);
      handleNewFollowers(newFollowers);
      // step 4: calc and handle dropped followers
      droppedFollowers = calcDroppedFollowers(prevFollowers, followers);
      await handleDroppedFollowers(droppedFollowers);
    })()
  ]);

  // if (profileData.numfollowers !== followers.length + 1) throw new Error('what?! your data.numfollowers != the followers we scraped.length');
  // doesn't equal for perhaps private profiles? idk
  const dateOnly = getDateFormatted().split(' ')[0].replaceAll('/', '-');
  statManager.set(dateOnly, {
    numposts: profileData.numposts,
    numfollowers: profileData.numfollowers,
    numfollowings: profileData.numfollowings,
    newfollowers: newFollowers,
    numnewfollowers: newFollowers.length,
    droppedfollowers: droppedFollowers,
    numdroppedfollowers: droppedFollowers.length
  });




};

module.exports = daily;
