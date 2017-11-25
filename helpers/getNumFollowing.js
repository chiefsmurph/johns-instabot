const handleManager = require('../modules/handleManager');

const getNumFollowing = () => {
  return handleManager.filterHandles(handleObj => handleObj.youfollowthem).length
};

module.exports = getNumFollowing;
