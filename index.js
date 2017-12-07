require('dotenv').config()

if (!process.env.INSTA_USERNAME || !process.env.INSTA_PASSWORD) {
  return console.log('create a .env with your instagram login credentials');
}

// npm
const puppeteer = require('puppeteer');

// actions
const startLiking = require('./actions/multiple/startLiking');
const checkForUnfollows = require('./actions/multiple/checkForUnfollows');

const initApp = require('./helpers/initApp');

// utils
const {
  msToMin,
  randBetween
} = require('./utils');

// settings
const settings = require('./settings.js');


(run = async () => {

  console.log('starting');

  try {

    const { browser, cookies } = await initApp();

    if (settings.likes && settings.likes.enabled) {
      startLiking(settings.likes.tags, cookies, browser);
    }

    if (settings.follows && settings.follows.targetFollowCount) {
      checkForUnfollows(cookies, browser);
    }

  } catch (e) {
    console.error('TRY ME', e);
    await run();
  }


})();
