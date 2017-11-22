const handleManager = require('../../modules/handleManager');

const alreadyLiked = (url) => {
  return handleManager.filterHandles(handleObj => {
    if (!handleObj.postsLiked) return false;
    const handleUrls = handleObj.postsLiked.map(like => like.url);
    return handleUrls.indexOf(url) !== -1;
  }).length;
};
