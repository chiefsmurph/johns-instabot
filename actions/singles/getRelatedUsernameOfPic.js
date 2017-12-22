const getRelatedUsernameOfPic = async (picUrl, cookies, browser) => {

  let page = await browser.newPage();

  const navigateToPhotoPage = async () => {
    const url = picUrl;
    console.log('url: ', url);
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const cleanUp = async () => {
    console.log('done getting username of ' + picUrl);
    await page.close();
  };

  // run
  try {
    await navigateToPhotoPage();
    return await page.evaluate(() => document.querySelector('article > header div > div > a').textContent);
  } catch (e) {
    console.error(e, picUrl);
  } finally {
    await cleanUp();
  }


};

module.exports = getRelatedUsernameOfPic;
