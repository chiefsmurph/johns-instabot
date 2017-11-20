module.exports = {
  peopleOfInterest: {
    minFollowers: 10,
    minFollowing: 10,
    minFollowerToFollowingRation: 2 // example: 10 followers, 5 following
  },
  likes: {
      enabled: true,                // required
      tags: ['hipster', 'indie'],   // required
      targetPerHour: 60,            // target number of pic likes per hour
      waitToLikeRange: [0, 0]      // a random amount of time between these two lengths of time in minutes to wait before liking the pic
  },
  comments: null,
  follows: {
      enabled: true,
      tags: ['hipster', 'indie'],
      targetPerDay: 100,
  }
};
