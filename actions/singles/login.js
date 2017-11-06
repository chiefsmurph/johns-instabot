// auth = {username: 'abc', password: 'def'}
const newHorseman = require('../../utils/newHorseman');

const login = auth => {

  return new Promise((resolve, reject) => {

    console.log('logging in...');
    const horseman = newHorseman();

    horseman
      .open('https:/instagram.com/accounts/login/')
      .then(function() {
        console.log('opened login page');
      })
      .wait(1000)
      .type('input[name="username"]', auth.username)
      .type('input[name="password"]', auth.password)
      .then(function() {
        console.log('finished typing now submitting!');
      })
      .click('button')
      .waitForNextPage()
      .screenshot('/screenshots/loggedin.png')
      .cookies()
      .then(function(cookies) {

        console.log('done logging in to instagram')
        horseman.close();
        resolve(cookies);

      });

  });

};

module.exports = login;
