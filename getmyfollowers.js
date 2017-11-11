require('dotenv').config()


const getFollowersList = require('./actions/singles/getFollowersList');
const login = require('./actions/singles/login');



(run = () => {

  console.log('starting');

  login({
    username: process.env.INSTA_USERNAME,
    password: process.env.INSTA_PASSWORD
  })
  .then(cookies => {

    getFollowersList('johnpatrickblaisemurphy', cookies)
      .then(followers => console.log(followers, followers.length));

  });

})();
