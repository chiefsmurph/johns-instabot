// actions
const getPhotosAndScheduleLikes = require('./getPhotosAndScheduleLikes');

// utils
const {
  msToMin,
  randBetween
} = require('../../utils');

// settings
const settings = require('../../settings.json');


const startLiking = (category, cookies) => {

  (continuallyRun = cb => {
    getPhotosAndScheduleLikes(category, cookies)
      .then(() => {

        const { maxPerHour } = settings.likes;
        const numPerCall = 2;
        const neededCallsPerHour = maxPerHour / numPerCall;
        const msInHr = 60000 * 60;
        const desiredWaitTimeInMs = msInHr / neededCallsPerHour;

        const randLimits = {
          low: desiredWaitTimeInMs - (desiredWaitTimeInMs / 3),
          high: desiredWaitTimeInMs + (desiredWaitTimeInMs / 3)
        };

        const waitTime = randBetween(randLimits.low, randLimits.high); // 1 - 3 min

        setTimeout(continuallyRun, waitTime);  // 1 - 3 minutes
        console.log('going to schedule more pic likes in: ' + msToMin(waitTime) + ' min' );


      })
      .catch(e => {
        console.error('error', e);
      });
  })();

};

module.exports = startLiking;
