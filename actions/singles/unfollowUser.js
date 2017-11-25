const timeoutPromise = require('../../utils/timeoutPromise');

const unfollowUser = async (username, cookies, browser, retrigTimes = 0) => {

  let page = await browser.newPage();

  const navigateToProfile = async () => {
    const url = `https://www.instagram.com/${username}`;
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const clickUnfollow = async () => {
    await page.waitFor(1000);
    const btnSelector = 'article > header > section > div > span > span > button';
    const isCurrentlyFollowing = await page.evaluate((sel) => document.querySelector(sel).innerText, btnSelector) === 'Following';
    if (!isCurrentlyFollowing) throw new Error('not currently following user', username);
    await page.click('article > header > section > div > span > span > button');
    await page.waitFor(3000);
  };

  const screenshot = async () => {
    await page.screenshot({ path: 'screenshots/unfollows/' + username +  '.png' });
  };

  const cleanUp = async () => await page.close();

  // run
  try {
    console.log('unfollowing ', username);
    await navigateToProfile();
    await clickUnfollow();
    await screenshot();
    console.log('successfully unfollowed ', username);
    if (retrigTimes) {
      console.log('fixed a problem after retrig', username);
    }
  } catch (e) {
    console.error(e, username);
    if (retrigTimes < 1 && e.toString().indexOf('not currently following user') === -1) {
      console.log('error - retriggering unfollow ', username, ' in 5 seconds', retrigTimes);
      await timeoutPromise(5000);
      try {
        await unfollowUser(username, cookies, browser, ++retrigTimes);
      } catch (secondError) {
        console.error('secondError', secondError);
      }
    }
  } finally {
    await cleanUp();
  }


};

module.exports = unfollowUser;
