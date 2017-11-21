String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const getDataForUser = async (username, cookies, browser) => {

  let page = await browser.newPage();

  const navigateToUserPage = async () => {
    const url = `https://www.instagram.com/${username}`;
    console.log('url: ', url);
    await page.setCookie(...cookies);
    await page.goto(url);
  };

  const retrieveDataUsers = async () => {
    return await page.evaluate(function() {
      return {
        fullname: document.querySelector('article > header > section > div:nth-child(3) > h1').innerText,
        numposts: document.querySelector('article > header > section > ul > li > span > span').innerText,
        numfollowers: document.querySelector('article > header > section > ul > li:nth-child(2) > a > span').innerText,
        numfollowings: document.querySelector('article > header > section > ul > li:nth-child(3) > a > span').innerText
      };
    });
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
    ['numposts', 'numfollowers', 'numfollowings'].forEach(key => {
      data[key] = Number(data[key].replaceAll("k", ",000").replaceAll(",", ""));
    });
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
