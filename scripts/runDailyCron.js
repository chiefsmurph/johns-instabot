require('dotenv').config()


const dailyCron = require('../actions/crons/daily');
const login = require('../actions/singles/login');

const puppeteer = require('puppeteer');
const handleManager = require('../modules/handleManager');

(run = async () => {

  console.log('starting');
  await handleManager.init();
  const browser = await puppeteer.launch({ headless: false });

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);

  const data = await dailyCron(cookies, browser);
  return;

})();
