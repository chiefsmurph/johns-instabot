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
const unfollowUser = require('../singles/unfollowUser');
const login = require('../singles/login');

// utils
const getDateFormatted = require('../../utils/getDateFormatted');



const puppeteer = require('puppeteer');




const daily = async () => {


  // init

  const handleManager = require('../../modules/handleManager');

  console.log('starting');
  await handleManager.init();
  const browser = await puppeteer.launch({headless: true});

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);

  // helpers
  const calcNewFollowers = (prevFollowers, currentFollowers) => {
    return currentFollowers.filter(username => prevFollowers.indexOf(username) === -1);
  };

  const calcDroppedFollowers = (prevFollowers, currentFollowers) => {
    return prevFollowers.filter(username => currentFollowers.indexOf(username) === -1);
  };

  const handleNewFollowers = async newFollowers => {
    console.log('handling new followers');
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
    console.log('handling dropped followers');
    for (let username of droppedFollowers) {
      let data = {
        neverfollow: true,
        unfollowedyouon: getDateFormatted(),
        followsyou: false
      }
      const foundHandle = handleManager.getHandle(username);
      if (foundHandle && foundHandle.youfollowthem) {
        console.log('unfollowing user', username);
        try {
          await unfollowUser(username, cookies, browser);
          console.log('done unfollowing now update db');
          data = {
            ...data,
            youfollowthem: false,
            youunfollowedthemon: getDateFormatted()
          };
        } catch (e) {
          console.log('db said you were following ', username, ' but you are not')
        }
      }
      await handleManager.mergeAndSave(username, data);
    }
  };

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
      // step 3: calc new and dropped followers
      newFollowers = calcNewFollowers(prevFollowers, followers);
      console.log('newFollowers', newFollowers);
      droppedFollowers = calcDroppedFollowers(prevFollowers, followers);
      console.log('droppedFollowers', droppedFollowers);
      // step 4: handle new and dropped followers
      await handleNewFollowers(newFollowers);
      await handleDroppedFollowers(droppedFollowers);
    })()
  ]);


  // additional stats

  const numNewFollowersFromBot = newFollowers.filter(handleObj => {
    return handleObj.youfollowedthem || handleObj.postsLiked;
  }).length;

  // effectiveness rate

  const dateWithinPastSevenDays = date => {
    var today = new Date();
    var pastWeek = Date.parse(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7));
    return (Date.parse(date) > pastWeek);
  };
  const pastSevenDaysHandles = handleManager.filterHandles(obj => {
    return (obj.postsLiked && dateWithinPastSevenDays(obj.postsLiked[0].date)) ||
        (obj.youfollowedthemon && dateWithinPastSevenDays(obj.youfollowedthemon));
  });
  const statBreakdown = (handles, header) => {
    const total = handles.length;
    const numFollow = handles.filter(obj => obj.followsyou).length;
    const perc = (numFollow / total * 100).toFixed(2);
    console.log('...of ' + total + ' people', numFollow, ' follow you', '(', perc, '%)\n');
    return {
      total,
      percfollowback: Number(perc)
    };
  };
  const pastSevenDaysStats = statBreakdown(pastSevenDaysHandles, 'pastSevenDaysHandles');

  // if (profileData.numfollowers !== followers.length + 1) throw new Error('what?! your data.numfollowers != the followers we scraped.length');
  // doesn't equal for perhaps private profiles? idk
  const dateOnly = getDateFormatted().split(' ')[0].replaceAll('/', '-');
  statManager.set(dateOnly, {
    numfollowers: profileData.numfollowers,
    numnewfollowers: newFollowers.length,
    numdroppedfollowers: droppedFollowers.length,
    pastSevenDaysStats,
    numfollowings: profileData.numfollowings,
    numposts: profileData.numposts,
  });



  await browser.close();

};

module.exports = daily;
