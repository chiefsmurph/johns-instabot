const executeHorseman = require('../../utils/executeHorseman');

const getPhotosForTag = (tag, cookies) => {
  return new Promise(function(resolve, reject) {
    const url = `https://www.instagram.com/explore/tags/${tag}`;
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
        .evaluate(function() {
          return [].slice.call(document.querySelectorAll('a')).map(function(a) { return a.href });
        })
        .then(urls => {
          console.log('done getting photos for tag ' + tag);
          horseman.close();
          resolve(urls);
        });
    });

  });
};

module.exports = getPhotosForTag;
