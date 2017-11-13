// auth = {username: 'abc', password: 'def'}
const newHorseman = require('../../utils/newHorseman');


const login = async (auth) => {

  const navigateToLoginPage = async () => {
    return await horseman
          .open('https:/instagram.com/accounts/login/')
          .then(() => console.log('opened login page'))
          .wait(1000);
  };

  const typeAndSubmitCredentials = async () => {
    return await horseman
          .type('input[name="username"]', auth.username)
          .type('input[name="password"]', auth.password)
          .then(() => console.log('finished typing now submitting!'))
          .click('button')
          .waitForNextPage();
  };

  const screenshot = async () => horseman.screenshot('/screenshots/loggedin.png');
  const getCookies = async () => horseman.cookies();
  const cleanUp = async () => horseman.close();

  // run
  const horseman = newHorseman();
  let responseCookies;
  try {
    console.log('logging in...');
    await navigateToLoginPage();
    await typeAndSubmitCredentials();
    await screenshot();
    responseCookies = await getCookies();
    await cleanUp();
  } catch (e) {
    console.error(e);
    console.log('error retriggering login');
    responseCookies = await login(auth);
  } finally {
    return responseCookies;
  }


};

module.exports = login;
