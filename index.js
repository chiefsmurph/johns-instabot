require('dotenv').config()

const getPhotosAndLike = require('./actions/multiple/getPhotosAndScheduleLikes');
const login = require('./actions/singles/login');

const {
  msToMin,
  randBetween
} = require('./utils');


var startLiking = function(category, cookies) {

  getPhotosAndScheduleLikes(category, randBetween(1, 3), cookies );

};


var run = function() {

  console.log('starting');

  login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  })
  .then(cookies => {

      startLiking('live', cookies);

  });

};


run();
