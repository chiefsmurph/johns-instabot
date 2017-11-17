require('dotenv').config()


const getFollowersList = require('./actions/singles/getFollowersList');
const login = require('./actions/singles/login');

const puppeteer = require('puppeteer');

(run = async () => {

  console.log('starting');

  const browser = await puppeteer.launch();

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);

  const followers = await getFollowersList('johnpatrickblaisemurphy', cookies, browser);
  console.log(followers, followers.length);

})();
