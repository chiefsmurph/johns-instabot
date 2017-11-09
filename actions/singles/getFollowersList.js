const executeHorseman = require('../../utils/executeHorseman');

const getFollowersList = (username, cookies) => {
  return new Promise(function(resolve, reject) {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);

    executeHorseman(horseman => {
      horseman
        .on('consoleMessage', function( msg ){
          console.log('console', msg);
        })
        .on('resourceError',function(err)  {
          console.log('resource', err);
        })
        .cookies(cookies)
        .open(url)
        .wait(6000)
        .click('article > header > section > ul > li:nth-child(2) > a')
        .wait(2000)
        .then(log => console.log(log, 'log'))
        .evaluate(function() {
          var allLis = [].slice.call(document.querySelectorAll('[role="dialog"] ul li'));
          return allLis.map(function(li) {
            return $(li).text();
          });
        })
        .then(followers => {
          console.log('done getting followers of ' + username);
          horseman.close();
          resolve(followers);
        });
    });

  });
};

module.exports = getFollowersList ;
