const handleManager = require('../modules/handleManager');

(async () => {
  await handleManager.init()
  const mutualFollows = handleManager.filterHandles(obj => {
    return obj.youfollowthem && obj.followsyou;
  });


  console.log(JSON.stringify(mutualFollows, null, 2), mutualFollows.length);

})();
