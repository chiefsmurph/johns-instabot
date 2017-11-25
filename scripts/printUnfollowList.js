const handleManager = require('../modules/handleManager');
const getUnfollowList = require('../helpers/getUnfollowList');

(async () => {
  await handleManager.init()
  await getUnfollowList();


  console.log(JSON.stringify(inDescOrder, null, 2));

})();
