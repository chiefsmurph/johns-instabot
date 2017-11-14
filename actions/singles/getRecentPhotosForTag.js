const newHorseman = require('../../utils/newHorseman');
const timeoutPromise = require('../../utils/timeoutPromise');

const getRecentPhotosForTag = async (tag, num, cookies, browser, retrigTimes = 0) => {

  const page = await browser.newPage();

  const navigateToTagPage = async () => {
    const url = `https://www.instagram.com/explore/tags/${tag}`;
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const retrieveRecentPhotos = async () => {
    const picUrls = await page.evaluate(function() {
        return [].slice.call(document.querySelectorAll('a')).map(function(a) { return a.href });
    })
    return picUrls.splice(9, num);
  };

  const cleanUp = async () => {
    console.log('done getting photos for tag ' + tag);
    await page.close();
  };

  // run
  console.log('getting ', num, ' recent photos for tag: ' + tag);
  const horseman = newHorseman();
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
