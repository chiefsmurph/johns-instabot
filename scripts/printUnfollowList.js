const handleManager = require('../modules/handleManager');
const getUnfollowList = require('../helpers/getUnfollowList');

(async () => {
  await handleManager.init()
  const unfollowList = await getUnfollowList();


  console.log(JSON.stringify(unfollowList, null, 2));

})();
