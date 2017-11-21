// db
const Document = require('../lib/johns-json-db/document');
const Stats = new Document('./logs/stats.json');

const statManager = (() => {

  console.log('here');

  (async () => {
    await Stats.init();
    console.log('done initing stats');
  })();

  return {
    get: () => Stats.get(),
    set: async (data) => await Stats.mergeAndSave(data, true)
  };

})();

module.exports = statManager;
