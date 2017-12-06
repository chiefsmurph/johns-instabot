require('dotenv').config()

const cron = require('cron');

const getDateFormatted = require('../utils/getDateFormatted');


const dailyCron = require('../actions/crons/daily');

const runDaily = async () => {

  console.log('running daily cron at ', getDateFormatted());
  const data = await dailyCron();

};
runDaily();
const dailyCronJob = new cron.CronJob('00 01 00 * * *', runDaily).start();

console.log('daily cron started at ', getDateFormatted());
