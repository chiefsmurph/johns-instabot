
(async () => {


  const handleManager = await require('../modules/handleManager').init();
  console.log(handleManager);

  const yourFollowers = handleManager.filterHandles(handleObj => {
    const hasLikes = !!handleObj.postsLiked;
    if (!hasLikes) return false;
    const likeUrls = handleObj.postsLiked.map(obj => obj.url);
    const hasDups = likeUrls.some((url, idx) => likeUrls.indexOf(url) !== idx);
    return hasDups;
  });


  console.log(JSON.stringify(yourFollowers, null, 2));

})();
