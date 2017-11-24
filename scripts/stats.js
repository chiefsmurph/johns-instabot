const logging = require('../utils/logging');

(async () => {

  

  const handleManager = await require('../modules/handleManager').init();

  const statBreakdown = (handles, header) => {
    console.log('stat breakdown of ', header);
    const total = handles.length;
    const numFollow = handles.filter(obj => obj.followsyou).length;
    const perc = (numFollow / total * 100).toFixed(2);
    console.log('...of ' + total + ' people', numFollow, ' follow you', '(', perc, '%)\n');
  };

  // % of people who follow you who you have only liked and not followed
  logging.header('BREAKDOWN BY LIKES VS LIKE & FOLLOWS');
  const peopleWhoYouHaveOnlyLiked = handleManager.filterHandles(handleObj => {
    return handleObj.postsLiked && !handleObj.youfollowthem;
  });
  statBreakdown(peopleWhoYouHaveOnlyLiked, 'peopleWhoYouHaveOnlyLiked');
  // % of people who follow you who you have liked and followed
  const peopleWhoYouHaveLikedAndFollowed = handleManager.filterHandles(handleObj => {
    return handleObj.postsLiked && handleObj.youfollowthem;
  });
  statBreakdown(peopleWhoYouHaveLikedAndFollowed, 'peopleWhoYouHaveLikedAndFollowed');

  // breakdown by tag
  logging.header('BREAKDOWN BY TAG');
  const peopleYouHaveLiked = handleManager.filterHandles(handleObj => {
    return handleObj.postsLiked;
  });
  const data = {};
  peopleYouHaveLiked.forEach(handleObj => {
    const tags = handleObj.postsLiked.map(like => like.relatedtag);
    const uniqTags = tags.filter(function(tag, idx) {
        return tags.indexOf(tag) == idx;
    });
    uniqTags.forEach(tag => {
      data[tag] = (data[tag] || []).concat(handleObj);
    });
  });
  Object.keys(data).forEach(tag => {
    statBreakdown(data[tag], 'tag breakdown: ' + tag);
  });

  // breakdown by followers to followings
  logging.header('BREAKDOWN BY FOLLOWER TO FOLLOWINGS RATIO');
  const peopleWhoFollowMoreThanFollowings = handleManager.filterHandles(handleObj => {
    return handleObj.numfollowings > handleObj.numfollowers;
  });

  const peopleWhoAreFollowedMoreThanTheyFollow = handleManager.filterHandles(handleObj => {
    return handleObj.numfollowers > handleObj.numfollowings;
  });

  const peopleWhoFollowTheSameNumberThatTheyAreFollowedBy = handleManager.filterHandles(handleObj => {
    return handleObj.numfollowers === handleObj.numfollowings;
  });
  statBreakdown(peopleWhoFollowMoreThanFollowings, 'peopleWhoFollowMoreThanFollowings');
  statBreakdown(peopleWhoAreFollowedMoreThanTheyFollow, 'peopleWhoAreFollowedMoreThanTheyFollow');
  statBreakdown(peopleWhoFollowTheSameNumberThatTheyAreFollowedBy, 'peopleWhoFollowTheSameNumberThatTheyAreFollowedBy');

})();
