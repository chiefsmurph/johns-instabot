module.exports = {
  likes: {
      enabled: true,
      maxPerHour: 60,             // target number of pic likes per hour
      waitToLikeRange: [0, 1]    // a random amount of time between these two lengths of time in minutes to wait before liking the pic
  },
  comments: null,
  follows: null
};
