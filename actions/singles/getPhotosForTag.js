const newHorseman = require('../../utils/newHorseman');

const getPhotosForTag = (tag, cookies) => {
  return new Promise(function(resolve, reject) {
    var picUrls;
    var horseman = newHorseman();
    var url = `https://www.instagram.com/explore/tags/${tag}`;
    console.log('url: ', url);

    horseman
      .cookies(cookies)
      .open(url)
      .evaluate(function() {
        return [].slice.call(document.querySelectorAll('a')).map(function(a) { return a.href });
      })
      .then(function(urls) {
        picUrls = urls;
        // console.log('picUrls', picUrls);
      })
      // .screenshot('.png')
      .then(function() {
        console.log('done getting photos for tag');
        horseman.close();
        resolve(picUrls);
      });
  });
};

module.exports = getPhotosForTag;
