const timeoutPromise = require('../../utils/timeoutPromise');
const handleManager = require('../../modules/handleManager');

const getRecentPhotosForTag = async (tag, cookies, browser, retrigTimes = 0) => {

  await handleManager.init();
  const page = await browser.newPage();

  const navigateToTagPage = async () => {
    const url = `https://www.instagram.com/explore/tags/${tag}`;
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const retrieveRecentPhotos = async () => {
    await page.evaluate(_ => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitFor(3000);
    let picUrls = await page.evaluate(function() {
        return [].slice.call(document.querySelectorAll('div > div > div > div > div a')).map(function(a) { return a.href });
    });
    await page.screenshot({ path: 'screenshots/relatedpng.png' });
    picUrls = picUrls
      .filter(url => url.includes('/p/'));
    console.log({ picUrls })
    picUrls = picUrls
      .slice(0, 9);
    // const beforeLength = picUrls.length;
    // console.log('beforeLength', beforeLength);
    // picUrls = picUrls;
    // const afterLength = picUrls.length;
    // if (beforeLength !== afterLength) {
    //   console.log('found ' + (beforeLength - afterLength) + ' pictures that were already liked in this tag retreival');
    // }
    await timeoutPromise(2000);
    return picUrls;
  };

  const cleanUp = async () => {
    console.log('done getting photos for tag ' + tag);
    await page.close();
  };

  
  // run
  console.log('getting recent photos for tag: ' + tag);
  let recentPhotos;
  try {
    await navigateToTagPage();
    recentPhotos = await retrieveRecentPhotos();
    console.log('found', recentPhotos.length, 'recent photos');
  } catch (e) {
    console.error(e, tag);
    if (retrigTimes < 3) {
      console.log('error - retriggering getRecentPhotosForTag ', tag, ' in 2 seconds', retrigTimes);
      await timeoutPromise(2000);
      recentPhotos = await getRecentPhotosForTag(tag, cookies, browser, ++retrigTimes);
    }
  } finally {
    await cleanUp();
    return recentPhotos;
  }

};


module.exports = getRecentPhotosForTag;
