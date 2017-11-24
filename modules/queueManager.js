// keeps track of which likes and follows are currently settimeout'd so you dont attempt an action that is already in the queue

const queueManager = (() => {

  let likeQueue = [];
  let followQueue = [];

  return {
    // likes
    addLike: url => likeQueue.push(url),
    removeLike: url => {
      likeQueue = likeQueue.filter(like => like !== url);
    },
    likeInQueue: url => likeQueue.includes(url),
    // follows
    addFollow: username => followQueue.push(username),
    removeFollow: username => {
      followQueue = followQueue.filter(follow => follow !== username);
    },
    followInQueue: username => followQueue.includes(username),
  };

})();

module.exports = queueManager;
