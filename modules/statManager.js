// stores all stats for your profile every day

const Collection = require('../lib/johns-json-db/collection');
const Stats = new Collection('stats', './logs');

const statManager = (() => {

  console.log('here');

  // (async () => {
  //
  //
  // })();

  return {
    init: async () => {
      await Stats.init();
      console.log('done initing stats');
    },
    get: (day) => Stats.getDoc(day),
    getAll: () => Stats.getAll(),
    set: async (day, data) => {
      if (Stats.getDoc('day')) {
        throw new Error('stats already set for this day: ', day)
      }
      await Stats.mergeAndSaveDoc(day, data);
    },
    getStatsOverTime: () => {
      const objStats = Stats.getAll({ format: 'object' });
      const returnStats = {};
      console.log(Object.keys(objStats));
      const chronKeys = Object.keys(objStats)
          .sort((a, b) => {
            return new Date(a) - new Date(b);
          });
      console.log('chron keuys', chronKeys);
      return chronKeys
          .reduce((acc, day, i) => {
            console.log(i, day);
            Object.keys(objStats[day]).forEach(key => {
              console.log(key, 'key', objStats[day][key], 'val')
              acc = {
                ...acc,
                [key]: (acc[key] || []).concat(objStats[day][key])
              };
              // console.log(key, objStats[day][key], objStats[day]);
            });
            return acc;
          }, {});
    }
  };

})();

module.exports = statManager;
