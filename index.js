require('dotenv').config()

if (!process.env.INSTA_USERNAME || !process.env.INSTA_PASSWORD) {
  return console.log('create a .env with your instagram login credentials');
}

// actions
const login = require('./actions/singles/login');
const startLiking = require('./actions/multiple/startLiking');

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

    const cookies = await login({
      username: process.env.INSTA_USERNAME,
      password: process.env.INSTA_PASSWORD
    });

    // console.log(cookies, 'cookies');
    if (settings.likes && settings.likes.enabled) {
      startLiking(settings.likes.tags, cookies)
    }

  } catch (e) {
    console.error('TRY ME');
    await run();
  }




})();
