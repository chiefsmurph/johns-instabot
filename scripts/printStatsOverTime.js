const statManager = require('../modules/statManager');

(async () => {
  await statManager.init();

  

  console.log(JSON.stringify(statManager.getStatsOverTime(), null, 2));

})();
