// auth = {username: 'abc', password: 'def'}
const newHorseman = require('../../utils/newHorseman');
const timeoutPromise = require('../../utils/timeoutPromise');

const login = async (auth, browser, retrigTimes = 0) => {

  let page = await browser.newPage();

  const navigateToLoginPage = async () => {
    await page.goto('https:/instagram.com/accounts/login/');
    console.log('opened login page');
  };

  const typeAndSubmitCredentials = async () => {
    // if (retrigTimes < 3) throw new Error("forced error");
    await page.type('input[name="username"]', auth.username);
    await page.type('input[name="password"]', auth.password)
    console.log('finished typing now submitting!');
    await page.click('button')
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  };

  const screenshot = async () => await page.screenshot('/screenshots/loggedin.png');
  const getCookies = async () => await page.cookies();
  const cleanUp = async () => await page.close();

  // run
  let responseCookies;
  try {
    console.log('logging in...');
    await navigateToLoginPage();
    await typeAndSubmitCredentials();
    await screenshot();
    responseCookies = await getCookies();
  } catch (e) {
    console.error(e);
    if (retrigTimes < 3) {
      console.log('error - retriggering login, ', retrigTimes);
      try {
        responseCookies = await login(auth, browser, ++retrigTimes);
      } catch (secondError) {
        console.error('secondError', secondError);
      }
    }
  } finally {
    await cleanUp();
    return responseCookies;
  }


};

module.exports = login;
