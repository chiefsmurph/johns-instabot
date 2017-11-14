module.exports = {
  likes: {
      enabled: true,              // required
      tags: ['hipster', 'indie'], // required
      targetPerHour: 60,             // target number of pic likes per hour
      waitToLikeRange: [0, 30]    // a random amount of time between these two lengths of time in minutes to wait before liking the pic
  },
  comments: null,
  follows: {
      enabled: true,
      tags: ['hipster', 'indie'],
      users: [''],
      targetPerDay: 100,
  }
};
