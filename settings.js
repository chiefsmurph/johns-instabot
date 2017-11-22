module.exports = {
  peopleOfInterest: {
    minFollowers: 10,
    minFollowing: 10,
    minFollowerToFollowingRation: 2 // example: 10 followers, 5 following
  },
  likes: {
      enabled: true,                // required
      tags: [
        'scrubs',
        'zachbraff',
        'hipster',
        'indie',
        'indiemusic',
        'piano',
        'songwriter'
      ],                            // required
      targetPerHour: 70,            // target number of pic likes per hour
      waitRange: [0, 15]            // a random amount of time between these two lengths of time in minutes to wait before liking the pic
      // waitRange: [0, 0.2]
  },
  comments: null,
  follows: {
      enabled: true,
      targetPerDay: 100,
      waitRange: [0, 60 * 6],
      // waitRange: [0, 0.4],
      unfollowAfterDays: 1,
      followToLikeRatio: 0.2
      // followToLikeRatio: 1
  }
};
