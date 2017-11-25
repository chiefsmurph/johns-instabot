require('dotenv').config()

const cron = require('cron');
const puppeteer = require('puppeteer');


const login = require('../actions/singles/login');

const getDateFormatted = require('../utils/getDateFormatted');


const runDaily = async () => {

  console.log('running daily cron at ', getDateFormatted());
  const handleManager = require('../modules/handleManager');
  const dailyCron = require('../actions/crons/daily');

  console.log('starting');
  await handleManager.init();
  const browser = await puppeteer.launch();

  const cookies = await login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  }, browser);

  const data = await dailyCron(cookies, browser);
  await browser.close();

};

runDaily();

const dailyCronJob = new cron.CronJob('00 01 00 * * *', runDaily).start();

console.log('daily cron started at ', getDateFormatted());
