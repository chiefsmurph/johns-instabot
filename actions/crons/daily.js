require('dotenv').config()

// once daily
// scan for all followers
// check for unfollows

// db
const statManager = require('../../db/statManager');
const handleManager = require('../../db/handleManager');
// actions
const getFollowersList = require('../singles/getFollowersList');
// utils
const getDateFormatted = require('../../utils/getDateFormatted');

const calcNewFollowers = (prevFollowers, currentFollowers) => {
  return currentFollowers.filter(username => prevFollowers.indexOf(username) === -1);
};

const calcDroppedFollowers = (prevFollowers, currentFollowers) => {
  return prevFollowers.filter(username => currentFollowers.indexOf(username) === -1);
};

const daily = async (cookies, browser) => {
  await handleManager.init();
  handleManager.setPuppeteerEnv({
    browser,
    cookies
  });
  // step 1: get new stats
  const followers = await getFollowersList(process.env.INSTA_USERNAME, cookies, browser);
  const prevStats = statManager.get();
  console.log('prevStats', prevStats);
  const prevFollowers = prevStats.followers || [];
  console.log('prevFollowers', prevFollowers);
  const newStats = {
    followercount: followers.length,
    followers
  };
  // step 2: write new stats
  await statManager.set(newStats);
  // step 3: calc new and dropped followers
  console.log('OLD FOLLOWERS', prevFollowers);
  console.log('NEW FOLLOWERS', followers);
  const newFollowers = calcNewFollowers(prevFollowers, followers);
  const droppedFollowers = calcDroppedFollowers(prevFollowers, followers);
  // step 4: do something
  console.log('newFollowers', newFollowers);
  for (let username of newFollowers) {
    const prevRecord = handleManager.getHandle(username);
    const alreadyInDb = !!prevRecord;
    if (alreadyInDb) console.log(username + ' is already in the db.');
    await handleManager.mergeAndSave(username, {
      followsyou: true,
      followedyouon: getDateFormatted(),
    }, !alreadyInDb);
  }
  console.log('droppedFollowers', droppedFollowers);
  for (let username of droppedFollowers) {
    await handleManager.mergeAndSave(username, {
      neverfollow: true,
      unfollowedyouon: getDateFormatted(),
      followsyou: false
    });
  }
};

module.exports = daily;
