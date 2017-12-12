// npm
const fs = require('mz/fs');

// actions
const getRecentPhotosForTag = require('../singles/getRecentPhotosForTag');
const likePicture = require('../singles/likePicture');
const scheduleFollow = require('./scheduleFollow');

// lib
const Document = require('../../lib/johns-json-db/document');
const LikeLogs = new Document('logs/likes.json');

// modules
const handleManager = require('../../modules/handleManager');
const queueManager = require('../../modules/queueManager');

// utils
const { randBetween, msToMin } = require('../../utils');
const getDateFormatted = require('../../utils/getDateFormatted');

// settings
const settings = require('../../settings.js');

// end imports


const logLike = async (username, likeData) => {
  // await LikeLogs.pushToArray('likes', likeData.url);
  // await fs.appendFile('logs/likes.txt', likeData.url + '\n');
  return await handleManager.mergeAndSave(username, {
    postsLiked: [likeData]
  }, true);
};

const getPhotosAndScheduleLikes = async (tag, cookies, browser) => {

  await handleManager.init();

  const scheduleLikeInFuture = (url) => {
    if (handleManager.alreadyLiked(url)) {
      throw new Error('already liked this post', url);
    }

    const rangeInMs = settings.likes.waitRange.map(min => min * 1000 * 60);
    const waitTime = randBetween.apply(null, rangeInMs);

    setTimeout(async () => {
      try {
        const { username } = await likePicture(url, cookies, browser);
        queueManager.removeLike(url);
        if (!username) { return; }
        console.log('username', username);
        const likeData = {
          url,
          relatedtag: tag,
          waittime: msToMin(waitTime),
          date: getDateFormatted()
        };
        console.log(username, likeData);
        const userData = await logLike(username, likeData);
        if (settings.follows && settings.follows.enabled) {
          if (!userData.neverfollow && Math.random() < settings.follows.followToLikeRatio) {
            if (!userData.youfollowedthemon && !queueManager.followInQueue(username)) {
              console.log('scheduling follow of ', username);
              await scheduleFollow(username, cookies, browser);
            }
          }
        }
      } catch (e) {
        console.error('likePicture error', e, 'though we shouldnt care because it was handled in likePicture');
      }
    }, waitTime);

    console.log('scheduled like of ' + url + ' in...' + msToMin(waitTime) + 'min');
    queueManager.addLike(url);
  };

  // run
  const randomRecentPhotos = await getRecentPhotosForTag(tag, cookies, browser);
  const num = randBetween(1, 3); // 1 3
  const photosOfInterest = randomRecentPhotos
    .filter(url => !handleManager.alreadyLiked(url))
    .filter(url => !queueManager.likeInQueue(url));
  const aFewRands = photosOfInterest
    .sort(() => Math.random() > Math.random())
    .splice(0, num);

  aFewRands.forEach(scheduleLikeInFuture);
  return;

};

module.exports = getPhotosAndScheduleLikes;
