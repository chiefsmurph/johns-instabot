// actions
const getPhotosAndScheduleLikes = require('./getPhotosAndScheduleLikes');

// utils
const {
  msToMin,
  randBetween
} = require('../../utils');

// settings
const settings = require('../../settings.js');


const startLiking = async (categories, cookies) => {

  return (async function continuallyRun() {

    const randCategory = categories[randBetween(0, categories.length - 1)];
    await getPhotosAndScheduleLikes(randCategory, cookies);

    // calculate wait time
    const { targetPerHour } = settings.likes;
    const numPerCall = 2;
    const neededCallsPerHour = targetPerHour / numPerCall;
    const msInHr = 60000 * 60;
    const targetWaitTimeInMs = msInHr / neededCallsPerHour;

    const randLimits = {
      low: targetWaitTimeInMs - (targetWaitTimeInMs / 3),
      high: targetWaitTimeInMs + (targetWaitTimeInMs / 3)
    };

    const waitTime = randBetween(randLimits.low, randLimits.high); // 1 - 3 min

    // schedule another round
    console.log('going to schedule more pic likes in: ' + msToMin(waitTime) + ' min' );
    return setTimeout(continuallyRun, waitTime);    // 1 - 3 minutes

  })();

};


module.exports = startLiking;
