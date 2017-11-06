const newHorseman = require('../../utils/newHorseman');

const getPhotosForTag = (tag, cookies) => {
  return new Promise(function(resolve, reject) {
    const horseman = newHorseman();
    const url = `https://www.instagram.com/explore/tags/${tag}`;
    console.log('url: ', url);

    horseman
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
};

module.exports = getPhotosForTag;
