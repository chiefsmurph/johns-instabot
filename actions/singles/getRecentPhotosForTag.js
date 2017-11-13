const newHorseman = require('../../utils/newHorseman');

const getRecentPhotosForTag = async (tag, num, cookies) => {

  const navigateToTagPage = async () => {
    const url = `https://www.instagram.com/explore/tags/${tag}`;
    console.log('url: ', url);
    return await horseman
          .on('consoleMessage', msg => {
            console.log('console', msg);
          })
          .on('resourceError', err => {
            console.log('resource', err, url);
          })
          .cookies(cookies)
          .open(url);
  };

  const retrieveRecentPhotos = async () => {
    return await horseman
          .evaluate(function() {
            return [].slice.call(document.querySelectorAll('a')).map(function(a) { return a.href });
          })
          .then(picUrls => picUrls.splice(9, num));
  };

  const cleanUp = async () => {
    console.log('done getting photos for tag ' + tag);
    return await horseman.close();
  };

  // run
  const horseman = newHorseman();
  let recentPhotos;
  try {
    await navigateToTagPage();
    recentPhotos = await retrieveRecentPhotos();
    await cleanUp();
    return recentPhotos;
  } catch (e) {
    console.error(e);
    console.log('error retriggering getRecentPhotosForTag');
    recentPhotos = await getRecentPhotosForTag(tag, num, cookies);
  } finally {
    return recentPhotos;
  }

};


module.exports = getRecentPhotosForTag;
