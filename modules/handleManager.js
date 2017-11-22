// db
const Collection = require('../lib/johns-json-db/collection');
const Handles = new Collection('handles', './logs');

// actions
const getDataForUser = require('../actions/singles/getDataForUser');


const handleManager = (() => {

  let puppeteerEnv = {};

  return {
    init: async () => {
      await Handles.init();
      return handleManager;
    },
    // get and save individuals
    getHandle: (username) => Handles.getDoc(username),
    mergeAndSave: async (username, data, refresh) => {
      // console.log('merging and saving', username, data);
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
    },
    // all handless
    filterHandles: (filterFn) => {
      return Handles.getAll().filter(filterFn);
    },
    getAll: () => Handles.getAll(),
    // specials
    alreadyLiked: (url) => {
      return handleManager.filterHandles(handleObj => {
        if (!handleObj.postsLiked) return false;
        const handleUrls = handleObj.postsLiked.map(like => like.url);
        return handleUrls.indexOf(url) !== -1;
      }).length;
    }
  };

})();

module.exports = handleManager;
