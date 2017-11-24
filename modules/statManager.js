// stores all stats for your profile every day

const Collection = require('../lib/johns-json-db/collection');
const Stats = new Collection('stats', './logs');

const statManager = (() => {

  console.log('here');

  (async () => {
    await Stats.init();
    console.log('done initing stats');
  })();

  return {
    get: (day) => Stats.getDoc(day),
    getAll: () => Stats.getAll(),
    set: async (day, data) => {
      if (Stats.getDoc('day')) {
        throw new Error('stats already set for this day: ', day)
      }
      await Stats.mergeAndSaveDoc(day, data);
    }
  };

})();

module.exports = statManager;
