// remembers yesterday's list of your followers to compare to tomorrows

const Document = require('../lib/johns-json-db/document');
const Follows = new Document('./logs/follows.json');

const followManager = (() => {

  console.log('here');

  (async () => {
    await Follows.init();
    console.log('done initing stats');
  })();

  return {
    get: () => Follows.get(),
    set: async (data) => await Follows.mergeAndSave(data, true)
  };

})();

module.exports = followManager;
