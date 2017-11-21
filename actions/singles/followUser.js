const timeoutPromise = require('../../utils/timeoutPromise');

const followUser = async (username, cookies, browser, retrigTimes = 0) => {

  let page = await browser.newPage();

  const navigateToProfile = async () => {
    const url = `https://www.instagram.com/${username}`;
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const clickFollow = async () => {
    await page.waitFor(1000);
    await page.click('article > header > section > div > span > span > button');
    await page.waitFor(3000);
  };

  const screenshot = async () => {
    await page.screenshot({ path: 'screenshots/follows/' + username +  '.png' });
  };

  const cleanUp = async () => await page.close();

  // run
  try {
    console.log('following ', username);
    await navigateToProfile();
    await clickFollow();
    await screenshot();
    console.log('successfully followed ', username);
    if (retrigTimes) {
      console.log('fixed a problem after retrig', username);
    }
  } catch (e) {
    console.error(e, username);
    if (retrigTimes < 3) {
      console.log('error - retriggering follow ', username, ' in 5 seconds', retrigTimes);
      await timeoutPromise(5000);
      try {
        await followUser(username, cookies, browser, ++retrigTimes);
      } catch (secondError) {
        console.error('secondError', secondError);
      }
    }
  } finally {
    await cleanUp();
  }


};

module.exports = followUser;
