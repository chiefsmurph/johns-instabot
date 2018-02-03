require('dotenv').config()

const { CronJob } = require('cron');

const getDateFormatted = require('../utils/getDateFormatted');


const dailyCron = require('../actions/crons/daily');

const runDaily = async () => {

  console.log('running daily cron at ', getDateFormatted());
  const data = await dailyCron();

};

new CronJob('00 01 00 * * *', runDaily, null, true);

if (process.argv[2] === 'true') {
  runDaily();
};

console.log('daily cron started at ', getDateFormatted());
