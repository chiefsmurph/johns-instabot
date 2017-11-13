const fs = require('mz/fs');

const newHorseman = require('../../utils/newHorseman');


const likePicture = async (url, cookies) => {

  let has404d = false;
  const navigateToPicturePage = async () => {
    return await horseman
          .on('consoleMessage', msg => {
            console.log('console', msg);
          })
          .on('resourceError', err => {
            console.log('resource', err, url);
            if (err.status === 404) has404d = true;
          })
          .cookies(cookies)
          .open(url)
          .wait(3000);
  };

  const likePost = async () => {
    return await horseman
          .click('article > div > section > a')
          .wait(3000)
  };

  const logLike = async () => await fs.appendFile('logs/likes.txt', url + '\n');

  const screenshotAndLog = async () => {
    let imgId = url.split('/');
    imgId = imgId[imgId.length - 2];
    return await horseman
          .screenshot('screenshots/likes/' + imgId +  '.png')
          .then(logLike);
  };

  const cleanUp = async () => await horseman.close();

  // run
  const horseman = newHorseman();
  try {
    console.log('liking ', url);
    await navigateToPicturePage();
    await likePost();
    await screenshotAndLog();
    await cleanUp();
    console.log('successfully liked ', url);
  } catch (e) {
    console.error(e);
    if (!has404d) {
      console.log('error retriggering like');
      await likePicture(url, cookies);
    } else {
      console.error('not retriggering - 404');
    }
  }


};

module.exports = likePicture;
