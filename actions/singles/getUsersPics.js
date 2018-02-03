
const getUsersPics = async (username, cookies, browser) => {

  let page = await browser.newPage();

  const navigateToUserPage = async () => {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);
    await page.setCookie(...cookies);
    await page.goto(url);
  };


  const cleanUp = async () => {
    console.log('done getting data of ' + username);
    await page.close();
  };

  // run
  try {
    console.log('getting users pics of ', username);
    await navigateToUserPage();
    return 
  } catch (e) {
    console.error(e, username);
  } finally {
    await cleanUp();
  }


};

module.exports = getUsersPics;
