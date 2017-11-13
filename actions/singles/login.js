// auth = {username: 'abc', password: 'def'}
const newHorseman = require('../../utils/newHorseman');
const timeoutPromise = require('../../utils/timeoutPromise');

const login = async (auth, retrigTimes = 0) => {

  const navigateToLoginPage = async () => {
    return await horseman
          .open('https:/instagram.com/accounts/login/')
          .then(() => console.log('opened login page'))
          .wait(1000);
  };

  const typeAndSubmitCredentials = async () => {
    // if (retrigTimes < 3) throw new Error("forced error");
    return await horseman
          .type('input[name="username"]', auth.username)
          .type('input[name="password"]', auth.password)
          .then(() => console.log('finished typing now submitting!'))
          .click('button')
          .waitForNextPage();
  };

  const screenshot = async () => await horseman.screenshot('/screenshots/loggedin.png');
  const getCookies = async () => await horseman.cookies();
  const cleanUp = async () => await horseman.close();

  // run
  const horseman = newHorseman();
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
        responseCookies = await login(auth, ++retrigTimes);
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
