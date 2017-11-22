

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
    addFollow: username => followQueue.push(url),
    removeFollow: username => {
      likeQueue = followQueue.filter(follow => follow !== username);
    },
    followInQueue: username => followQueue.includes(username),
  };

})();

module.exports = queueManager;
