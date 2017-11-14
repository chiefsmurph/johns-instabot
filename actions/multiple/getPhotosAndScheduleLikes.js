// npm
const async = require('async');
const fs = require('mz/fs');

// actions
const getRecentPhotosForTag = require('../singles/getRecentPhotosForTag');
const likePicture = require('../singles/likePicture');

// utils
const { randBetween, msToMin } = require('../../utils');

// settings
const settings = require('../../settings.js');

// end imports


const logLike = async (url) => await fs.appendFile('logs/likes.txt', url + '\n');

const getPhotosAndScheduleLikes = async (tag, cookies, browser) => {

  const getRandomPhotosFromTag = async () => {
    const num = randBetween(1, 3);
    return await getRecentPhotosForTag(tag, num, cookies, browser);
  };

  const scheduleLikeInFuture = (url) => {
    const rangeInMs = settings.likes.waitToLikeRange.map(min => min * 1000 * 60);
    const waitTime = randBetween.apply(null, rangeInMs);
    setTimeout(async () => {
      try {
        await likePicture(url, cookies, browser);
        await logLike(url);
      } catch (e) {
        console.error('likePicture error', e, 'though we shouldnt care because it was handled in likePicture');
      }
    }, waitTime);
    console.log('scheduled like of ' + url + ' in...' + msToMin(waitTime) + 'min');
  };

  // run
  const randomRecentPhotos = await getRandomPhotosFromTag();
  randomRecentPhotos.forEach(scheduleLikeInFuture);
  return;

};

module.exports = getPhotosAndScheduleLikes;
