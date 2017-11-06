// npm
const async = require('async');

// actions
const getPhotosForTag = require('../singles/getPhotosForTag');
const likePicture = require('../singles/likePicture');

// utils
const { randBetween, msToMin } = require('../../utils');

// settings
const settings = require('../../settings.js');

// end imports

const scheduleLikeInFuture = (url, cookies) => {
  const rangeInMs = settings.likes.waitToLikeRange.map(min => min * 1000 * 60);
  const waitTime = randBetween.apply(null, rangeInMs);
  setTimeout(() => {
    likePicture(url, cookies);
  }, waitTime);
  console.log('scheduled like of ' + url + ' in...' + msToMin(waitTime) + 'min');
};

const getRandomPhotosFromTag = (tag, cookies, cb) => {
  const num = randBetween(1, 3);
  getPhotosForTag(tag, cookies)
    .then(picUrls => {
      picUrls = picUrls.splice(9, num);
      cb(picUrls);
    });
};

const getPhotosAndScheduleLikes = (tag, cookies) => {
  return new Promise((resolve, reject) => {

    console.log('getting and liking for ' + tag);

    getRandomPhotosFromTag(tag, cookies, picUrls => {
      picUrls.forEach(url => {
        scheduleLikeInFuture(url, cookies);
      });
      console.log('done scheduling likes for ' + tag);
      resolve();
    });


  });

};

module.exports = getPhotosAndScheduleLikes;
