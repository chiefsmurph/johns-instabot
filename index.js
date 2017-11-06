require('dotenv').config()

const getPhotosAndScheduleLikes = require('./actions/multiple/getPhotosAndScheduleLikes');
const login = require('./actions/singles/login');

const {
  msToMin,
  randBetween
} = require('./utils');


const startLiking = (category, cookies) => {

  (continuallyRun = cb => {
    getPhotosAndScheduleLikes(category, cookies)
      .then(() => {
        const waitTime = randBetween(60000, 60000 * 3); // 1 - 3 min
        setTimeout(continuallyRun, waitTime);  // 1 - 3 minutes
        console.log('going to schedule more pic likes in: ' + msToMin(waitTime) + ' min' );
      });
  })();

};


(run = () => {

  console.log('starting');

  login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  })
  .then(cookies => {

      startLiking('live', cookies);

  });

})();
