// npm
const fs = require('mz/fs');

// actions
const getRecentPhotosForTag = require('../singles/getRecentPhotosForTag');
const likePicture = require('../singles/likePicture');
const getRelatedUsernameOfPic = require('../singles/getRelatedUsernameOfPic');
const getDataForUser = require('../singles/getDataForUser');

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
      console.log('scheduling like', url)
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


  // this is where for every tag scrape it likes randomNum (1-3) pics from randomNum different users

  const randomRecentPhotos = await getRecentPhotosForTag(tag, cookies, browser);
  
  const num = randBetween(1, 3); // 1 3


  // this is where for every tag scrape it likes randomNum (1-3) pics from 1 single users
  console.log({ randomRecentPhotos, num })
  const photosOfInterest = randomRecentPhotos
    .filter(url => !handleManager.alreadyLiked(url))
    .filter(url => !queueManager.likeInQueue(url))
    .slice(0, num);

  console.log('length photos', photosOfInterest.length);
  for (let url of photosOfInterest) {

    const relatedUsername = await getRelatedUsernameOfPic(url, cookies, browser);
    const hasPwned = !!(handleManager.getHandle(relatedUsername).hasPwned);
    if (hasPwned) continue;

    const userData = await getDataForUser(relatedUsername, cookies, browser);
    // if (userData.numfollowers < userData.numfollowings || userData.numfollowings < 50 || userData.numposts < 30) {
    //   console.log(userData.numfollowers, userData.numfollowings, userData.numposts);
    //   continue;
    // }

    let usersPics = userData.userspics;
    usersPics = usersPics
        .sort(() => Math.random() > Math.random())
        .splice(0, num - 1)
        .map(code => 'https://www.instagram.com/p/' + code);
    if (!usersPics.includes(url)) usersPics = [...usersPics, url];
    console.log('userpics', usersPics)
    usersPics.concat([url]).forEach(scheduleLikeInFuture);
    await handleManager.mergeAndSave(relatedUsername, {
      hasPwned: true
    });

    break;

  }


  // this is where for every tag scrape it likes randomNum (1-3) pics from randomNum different users

  //
  // const filteredByPrevLiked = [];
  // for (let url of photosOfInterest) {
  //   const relatedUsername = await getRelatedUsernameOfPic(url, cookies, browser);
  //   const numLikes = (handleManager.getHandle(relatedUsername).postsLiked || []).length;
  //   console.log('picurl: ', url);
  //   console.log('related username: ', relatedUsername);
  //   console.log('num likes: ', numLikes);
  //   if (numLikes < settings.likes.maxLikesPerUser) {
  //     filteredByPrevLiked.push(url);
  //   }
  //   if (filteredByPrevLiked.length === num) {
  //     console.log('got em bro');
  //     break;
  //   }
  // }
  //
  // if (filteredByPrevLiked.length !== num) {
  //   console.log('unable to find enough fresh content to meet quota of ' + num + ' pics');
  // }
  //
  // const aFewRands = filteredByPrevLiked
  //   .sort(() => Math.random() > Math.random())
  //   .splice(0, num);
  //
  // aFewRands.forEach(scheduleLikeInFuture);

  return;

};

module.exports = getPhotosAndScheduleLikes;
