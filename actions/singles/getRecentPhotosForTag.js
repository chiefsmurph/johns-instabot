const timeoutPromise = require('../../utils/timeoutPromise');
const handleManager = require('../../db/handleManager');

const getRecentPhotosForTag = async (tag, num, cookies, browser, retrigTimes = 0) => {

  await handleManager.init();
  const page = await browser.newPage();

  const navigateToTagPage = async () => {
    const url = `https://www.instagram.com/explore/tags/${tag}`;
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const retrieveRecentPhotos = async () => {
    let picUrls = await page.evaluate(function() {
        return [].slice.call(document.querySelectorAll('a')).map(function(a) { return a.href });
    });
    const beforeLength = picUrls.length;
    picUrls = picUrls.filter(url => !handleManager.alreadyLiked(url));
    const afterLength = picUrls.length;
    if (beforeLength !== afterLength) {
      console.log('found ' + (beforeLength - afterLength) + ' pictures that were already liked in this tag retreival');
    }
    return picUrls.splice(9, num);
  };

  const cleanUp = async () => {
    console.log('done getting photos for tag ' + tag);
    await page.close();
  };

  // run
  console.log('getting ', num, ' recent photos for tag: ' + tag);
  let recentPhotos;
  try {
    await navigateToTagPage();
    recentPhotos = await retrieveRecentPhotos();
  } catch (e) {
    console.error(e, tag);
    if (retrigTimes < 3) {
      console.log('error - retriggering getRecentPhotosForTag ', tag, ' in 2 seconds', retrigTimes);
      await timeoutPromise(2000);
      recentPhotos = await getRecentPhotosForTag(tag, num, cookies, browser, ++retrigTimes);
    }
  } finally {
    await cleanUp();
    return recentPhotos;
  }

};


module.exports = getRecentPhotosForTag;
