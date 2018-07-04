const timeoutPromise = require('../../utils/timeoutPromise');

const likePicture = async (url, cookies, browser, retrigTimes = 0) => {

  let page = await browser.newPage();
  let has404d = false;

  const navigateToPicturePage = async () => {
    await page.setCookie(...cookies);
    page.on('response', response => {
      has404d = (response.status === 404) || has404d;
    });
    await page.goto(url);
  };

  const clickLike = async () => {
    await page.click('article > div > section > span > button');
    await page.waitFor(3000);
  };

  const getUsername = async() => {
    return await page.evaluate(() => document.querySelector('article > header > div > div > div > a').innerText);
  };

  const screenshot = async () => {
    let imgId = url.split('/');
    imgId = imgId[imgId.length - 2];
    await page.screenshot({ path: 'screenshots/likes/' + imgId +  '.png' });
  };

  const cleanUp = async () => await page.close();

  // run
  try {
    console.log('liking ', url);
    await navigateToPicturePage();
    if (has404d) {
      return console.log('404 picture has been deleated - ', url);
    }
    await clickLike();
    const username = await getUsername();
    await screenshot();
    console.log('successfully liked ', url);
    if (retrigTimes) {
      console.log('fixed a problem after retrig', url);
    }
    return { username };
  } catch (e) {
    if (has404d) {
      return console.error('not retriggering - 404', url);
    }
    console.error(e, url);
    if (retrigTimes < 3) {
      console.log('error - retriggering like ', url, ' in 5 seconds', retrigTimes);
      await timeoutPromise(5000);
      try {
        await likePicture(url, cookies, browser, ++retrigTimes);
      } catch (secondError) {
        console.error('secondError', secondError);
      }
    }
  } finally {
    await cleanUp();
  }


};

module.exports = likePicture;
