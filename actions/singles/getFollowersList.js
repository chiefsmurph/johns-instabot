const executeHorseman = require('../../utils/executeHorseman')

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
        // .wait(2000)
        // .injectJs('https://github.com/chiefsmurph/johns-instabot/blob/master/injectjs/scrollFollowersDiv.js')
        .wait(6000)
        .click('article > header > section > ul > li:nth-child(2) > a')
        .wait(2000)
        // .evaluate(function() {
        //   return [scrollDiv];
        // })
        // .log()
        // .then(log => console.log(log, 'log'))
        .evaluate(function(done) {

          var scrollDiv = document.querySelector('[role="dialog"] > div > div > div:nth-child(2)');
          var scrolls = [];

          (function scrollIt() {
            var beforeHeight = scrollDiv.scrollHeight;
            scrolls.push(beforeHeight);
            setTimeout(function() {
              var nowHeight = scrollDiv.scrollHeight;
              if (beforeHeight === nowHeight) {
                done(null, scrolls);
              } else {
                scrollIt();
              }
            }, 2000);
            $(scrollDiv).scrollTop(beforeHeight);
          })();

        })
        .log()
        .evaluate(function() {
          var allLis = [].slice.call(document.querySelectorAll('[role="dialog"] ul li'));
          return allLis.map(function(li) {
            var $li = $(li);
            return {
              username: $(li).find('div > div > div > div:nth-child(1)').text(),
              fullname: $(li).find('div > div > div > div:nth-child(2)').text()
            };
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
