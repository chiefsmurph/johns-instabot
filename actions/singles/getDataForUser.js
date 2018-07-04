// formatting
require('../../utils/replaceAll');

const convertStringToNum = numberString => {
  if (!numberString) return '';
  if (numberString.indexOf('k') !== -1) {
    numberString = numberString.replaceAll('k', '');
    var numDecimalDigits = (numberString.indexOf('.') !== -1) ? numberString.length - numberString.indexOf('.') - 1 : 0;
    var numZerosNeeded = 3 - numDecimalDigits;
    numberString = numberString.split('.').join('') + Array(numZerosNeeded + 1).join('0');
  }
  numberString = Number(numberString.replaceAll(",", ""));
  return numberString;
};

// the meat
const getDataForUser = async (username, cookies, browser) => {

  let page = await browser.newPage();

  const navigateToUserPage = async () => {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const retrieveDataUsers = async () => {
    const getInnerText = async selector => {
      try {
        return await page.evaluate((sel) => document.querySelector(sel).innerText, selector);
      } catch (e) {
        return null
      }
    };
    const getUsersPics = async () => {
      try {
        return await page.evaluate(() => {
            const allImgs = [...document.querySelectorAll('a > div > div > img')];
            const allAs = allImgs.map(el => el.parentElement.parentElement.parentElement);
            const allPhotoIds = allAs.map(d => d.href.split('/')[4]);
            return allPhotoIds;
        });
      } catch (e) {
        return null
      }
    };
    return {
      numposts: convertStringToNum(await getInnerText('main > div > header > section > ul > li > span > span')),
      numfollowers: convertStringToNum(await getInnerText('main > div > header > section > ul > li:nth-child(2) > a > span')),
      numfollowings: convertStringToNum(await getInnerText('main > div > header > section > ul > li:nth-child(3) > a > span')),
      fullname: await getInnerText('main > div > header > section > div:nth-child(3) > h1'),
      userspics: await getUsersPics()
    };
  };

  const cleanUp = async () => {
    console.log('done getting data of ' + username);
    await page.close();
  };

  // run
  let data;
  try {
    console.log('getting data of ', username);
    await navigateToUserPage();
    data = await retrieveDataUsers();
    // console.log('data', data)
    // ['numposts', 'numfollowers', 'numfollowings'].forEach(key => {
    //     console.log('converting', key, data[key])
    //   data[key] = convertStringToNum(data[key]);
    // });
  } catch (e) {
    console.error(e, username);
  } finally {
    await cleanUp();
    return {
      ...data,
      username
    };
  }


};

module.exports = getDataForUser;
