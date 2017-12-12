module.exports = {
  peopleOfInterest: {
    minFollowers: 10,
    minFollowing: 10,
    minFollowerToFollowingRation: 2 // example: 10 followers, 5 following
  },
  likes: {
      enabled: true,                // required
      tags: [
        // 'zachbraff',
        // 'hipster',
        // 'indie',
        'indiemusic',
        // 'piano',
        // 'songwriter',
        // 'hipstyle',
        // 'internetcelebrity',
        // 'chaos',
        // 'dreampop',
        // 'indiepop',
        'experimentalmusic',
        // 'awesome',
        // 'randpaul',
        'followforfollow',
        'diddykongracing',
        'amazingview',
        'party',
        'gangsta',
        'lovers',
        'suburban',
        'instagram'
      ],                                // required
      targetPerHour: 80,                // target number of pic likes per hour
      waitRange: [0, 10]                // a random amount of time between these two lengths of time in minutes to wait before liking the pic
      // waitRange: [0, 0.2]
  },
  comments: null,
  follows: {
      enabled: true,
      targetPerDay: 100,
      waitRange: [0, 60 * 5],
      // waitRange: [0, 0.4],
      unfollowAfterDays: 1,
      followToLikeRatio: 0.01,
      // followToLikeRatio: 1,
      targetFollowCount: 50
  }
};
