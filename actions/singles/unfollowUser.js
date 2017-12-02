const timeoutPromise = require('../../utils/timeoutPromise');

const unfollowUser = async (username, cookies, browser, retrigTimes = 0) => {

  let page = await browser.newPage();

  const navigateToProfile = async (page) => {
    const url = `https://www.instagram.com/${username}`;
    // console.log('page', page);
    await page.setCookie(...cookies);
    await page.goto(url);
    await page.waitFor(2000);
  };

  const isCurrentlyFollowing = async (page) => {
    const btnSelector = 'article > header > section > div > span > span > button';
    return await page.evaluate((sel) => document.querySelector(sel).innerText, btnSelector) === 'Following';
  };

  const clickUnfollow = async () => {
    await page.waitFor(1000);
    const isFollowing = await isCurrentlyFollowing(page);
    console.log('isFollowing', isFollowing);
    if (!isFollowing) throw new Error('not currently following user', username);
    await page.click('article > header > section > div > span > span > button');
    await page.waitFor(3000);
  };

  const screenshot = async () => {
    await page.screenshot({ path: 'screenshots/unfollows/' + username +  '.png' });
  };

  const confirmUnfollowed = async () => {
    let secondPage = await browser.newPage();
    await navigateToProfile(secondPage);
    const isFollowing = await isCurrentlyFollowing(secondPage);
    console.log('isFollowing', isFollowing);
    if (isFollowing) {
      throw new Error('BLOCKED FROM FOLLOWING. rate-limited');
    } else {
      console.log('confirmed unfollow success');
    }
    await secondPage.close();
  };

  const cleanUp = async () => await page.close();

  // run
  try {
    console.log('unfollowing ', username);
    await navigateToProfile(page);
    await clickUnfollow();
    await screenshot();
    await confirmUnfollowed();
    console.log('successfully unfollowed ', username);
    if (retrigTimes) {
      console.log('fixed a problem after retrig', username);
    }
  } catch (e) {
    console.error(e, username);
    if (retrigTimes < 1 && e.toString().indexOf('innerText') != -1) {
      console.log('error - retriggering unfollow ', username, ' in 5 seconds', retrigTimes);
      await timeoutPromise(5000);
      try {
        await unfollowUser(username, cookies, browser, ++retrigTimes);
      } catch (secondError) {
        console.error('secondError', secondError);
      }
    } else {
      throw e;
    }
  } finally {
    await cleanUp();
  }


};

module.exports = unfollowUser;
