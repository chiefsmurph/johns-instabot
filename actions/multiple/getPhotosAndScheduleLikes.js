// npm
const async = require('async');

// actions
const getPhotosForTag = require('../singles/getPhotosForTag');
const likePicture = require('../singles/likePicture');

// utils
const { randBetween, msToMin } = require('../../utils');

// end imports

const getPhotosAndLike = (tag, num, cookies) => {
  return new Promise((resolve, reject) => {

    console.log('getting and liking for ' + tag + ' | num: ' + num);

    getPhotosForTag(tag, cookies)
        .then(picUrls => {
          picUrls = picUrls.splice(9, num);

          async.forEachSeries(picUrls, function(url, cb) {

            setTimeout(function() {

              var waitTime = randBetween(1000, 60000 * 18);
              setTimeout(function() {

                likePicture(url, cookies);

              }, waitTime);

              console.log('scheduled like of ' + url + ' in...' + msToMin(waitTime) + 'min');

              cb();
            }, randBetween(1000, 3000) );

          }, function() {

            console.log('done scheduling likes for ' + tag);

            var waitTime = randBetween(60000, 60000 * 3);
            console.log('scheduling in the future: ' + msToMin(waitTime) + ' min' );

            setTimeout(function() {
              getPhotosAndLike(tag, randBetween(1, 3), cookies);
            },  waitTime);  // 1 - 3 minutes

          });



        });


  });
};

module.exports = getPhotosAndLike;
