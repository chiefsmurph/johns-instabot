require('dotenv').config()

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


(run = () => {

  console.log('starting');

  login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  })
  .then(cookies => {
      console.log(cookies, 'cookies');
      if (settings.likes && settings.likes.enabled) {
        startLiking(settings.likes.tags, cookies)
      }

  });

})();
