// this doesnt work very well


require('dotenv').config()
const timeoutPromise = require('../utils/timeoutPromise');

const puppeteer = require('puppeteer');

const login = require('../actions/singles/login');


const getFollowingList = require('../actions/singles/getFollowingList');
const handleManager = require('../modules/handleManager');

(async () => {
  await handleManager.init();
  const browser = await puppeteer.launch({ headless: true });

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);
  handleManager.setPuppeteerEnv({
    browser,
    cookies
  });

  const followingList = await getFollowingList(process.env.INSTA_USERNAME, cookies, browser);

  console.log('followingList', followingList);

  for (let username of followingList) {
    const handleObj = handleManager.getHandle(username);
    console.log('username', username);
    // console.log('handleObj', handleObj);
    if (!handleObj || !handleObj.youfollowedthemon || !handleObj.youfollowthem) {
      // console.log('handleObj.youfollowedthemon', (handleObj ? handleObj.youfollowedthemon : '') );
      // await timeoutPromise(4000);
      await handleManager.mergeAndSave(username, {
        youfollowthem: true,
        youfollowedthemon: '11/01/2017  10:53 PM'
      }, !handleObj);
      await timeoutPromise(1000);
    }
  }


})();
