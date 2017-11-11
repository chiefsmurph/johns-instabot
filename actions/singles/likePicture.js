const fs = require('fs');

const executeHorseman = require('../../utils/executeHorseman');

const likePicture = (url, cookies) => {
  return new Promise((resolve, reject) => {

    console.log('liking url: ', url);

    let imgId = url.split('/');
    imgId = imgId[imgId.length - 2];

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
        .wait(3000)
        // .screenshot('beforeclick.png')
        // .mouseEvent('doubleclick', 560, 400)
        .click('article > div > section > a')
        .wait(3000)
        .screenshot('screenshots/likes/' + imgId +  '.png')
        .then(() => {
          console.log('done screenshot.');

          fs.appendFile('logs/likes.txt', url + '\n', err => {

            horseman.close();
            resolve();

          });


        })
        .catch(e => console.error('likerror', e, url));


    });

  });
};

module.exports = likePicture;
