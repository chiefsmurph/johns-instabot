// npm
const puppeteer = require('puppeteer');

// actions
const login = require('../actions/singles/login');

const handleManager = require('../modules/handleManager');

module.exports = async() => {

  await handleManager.init();
  const browser = await puppeteer.launch({headless: true });

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);

  // console.log(cookies, 'cookies');
  handleManager.setPuppeteerEnv({
    browser,
    cookies
  });

  return {
    browser,
    cookies
  };

};
