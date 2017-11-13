// npm
const async = require('async');

// actions
const getRecentPhotosForTag = require('../singles/getRecentPhotosForTag');
const likePicture = require('../singles/likePicture');

// utils
const { randBetween, msToMin } = require('../../utils');

// settings
const settings = require('../../settings.js');

// end imports


const getPhotosAndScheduleLikes = async (tag, cookies) => {

  const getRandomPhotosFromTag = async () => {
    const num = randBetween(1, 3);
    return await getRecentPhotosForTag(tag, num, cookies);
  };

  const scheduleLikeInFuture = (url) => {
    const rangeInMs = settings.likes.waitToLikeRange.map(min => min * 1000 * 60);
    const waitTime = randBetween.apply(null, rangeInMs);
    setTimeout(() => {
      likePicture(url, cookies);
    }, waitTime);
    console.log('scheduled like of ' + url + ' in...' + msToMin(waitTime) + 'min');
  };

  // run
  const randomRecentPhotos = await getRandomPhotosFromTag();
  randomRecentPhotos.forEach(scheduleLikeInFuture);
  return;
  
};

module.exports = getPhotosAndScheduleLikes;
