const handleManager = require('../../modules/handleManager');

const alreadyLiked = (url) => {
  return !!handleManager.filterHandles(handleObj => {
    if (!handleObj.postsLiked) return false;
    const handleUrls = handleObj.postsLiked.map(like => like.url);
    const found = handleUrls.indexOf(url) !== -1;
    if (found) {
      console.log('found', url, 'in', handleObj.username, 'postlikes');
    }
    return found;
  }).length;
};
