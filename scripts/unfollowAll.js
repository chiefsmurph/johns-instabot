
// WARNING
// unfollows everybody that is not following back


require('dotenv').config()
const timeoutPromise = require('../utils/timeoutPromise');

const puppeteer = require('puppeteer');

const login = require('../actions/singles/login');


const getFollowingList = require('../actions/singles/getFollowingList');
const handleManager = require('../modules/handleManager');
const unfollowAndLogMultiple = require('../actions/multiple/unfollowAndLogMultiple');

(async () => {
  await handleManager.init();
  const browser = await puppeteer.launch({ headless: true});

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);
  handleManager.setPuppeteerEnv({
    browser,
    cookies
  });

  const currentlyFollowing = handleManager.filterHandles(handleObj => {
    return handleObj.youfollowthem && !handleObj.followsyou;
  }).sort((a, b) => new Date(a.youfollowedthemon) - new Date(b.youfollowedthemon));

  await unfollowAndLogMultiple(currentlyFollowing.map(handleObj => handleObj.username), cookies, browser);


})();
