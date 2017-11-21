// db
const Collection = require('../lib/johns-json-db/collection');
const Handles = new Collection('handles', './logs');

// actions
const getDataForUser = require('../actions/singles/getDataForUser');


const handleManager = (() => {

  (async () => await Handles.init())();

  let puppeteerEnv = {};

  return {
    getHandle: (username) => Handles.getDoc(username),
    mergeAndSave: async (username, data, refresh) => {
      console.log('merging and saving', username, data);
      if (refresh) {
        const userData = await getDataForUser(username, puppeteerEnv.cookies, puppeteerEnv.browser);
        data = {
          ...userData,
          ...data
        };
      }
      return await Handles.mergeAndSaveDoc(username, data);
    },
    setPuppeteerEnv: (env) => {
      puppeteerEnv = env;
    }
  };

})();

module.exports = handleManager;
