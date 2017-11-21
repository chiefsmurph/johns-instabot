require('dotenv').config()


const getDataForUser = require('./actions/singles/getDataForUser');
const login = require('./actions/singles/login');

const puppeteer = require('puppeteer');

(run = async () => {

  console.log('starting');

  const browser = await puppeteer.launch();

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);

  const data = await getDataForUser('johnpatrickblaisemurphy', cookies, browser);
  console.log(data);

})();
