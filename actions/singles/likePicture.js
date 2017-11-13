const newHorseman = require('../../utils/newHorseman');
const timeoutPromise = require('../../utils/timeoutPromise');

const likePicture = async (url, cookies, retrigTimes = 0) => {

  let has404d = false;
  const navigateToPicturePage = async () => {
    return await horseman
          .on('consoleMessage', msg => {
            // console.log('console', msg);
          })
          .on('resourceError', err => {
            // console.log('resource', err, url);
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

  const screenshot = async () => {
    let imgId = url.split('/');
    imgId = imgId[imgId.length - 2];
    return await horseman
          .screenshot('screenshots/likes/' + imgId +  '.png');
  };

  const cleanUp = async () => await horseman.close();

  // run
  const horseman = newHorseman();
  try {
    console.log('liking ', url);
    await navigateToPicturePage();
    await likePost();
    await screenshot();
    console.log('successfully liked ', url);
    if (retrigTimes) {
      console.log('fixed a problem after retrig', url);
    }
  } catch (e) {
    if (has404d) {
      return console.error('not retriggering - 404', url);
    }
    console.error(e, url);
    if (retrigTimes < 3) {
      console.log('error - retriggering like ', url, ' in 5 seconds', retrigTimes);
      await timeoutPromise(5000);
      try {
        await likePicture(url, cookies, ++retrigTimes);
      } catch (secondError) {
        console.error('secondError', secondError);
      }
    }
  } finally {
    await cleanUp();
  }


};

module.exports = likePicture;
