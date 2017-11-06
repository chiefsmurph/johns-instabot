const actions = [
  'login',
  'likePicture',
  'getPhotosForTag'
];

module.exports = actions.reduce((acc, val) => {
  acc[val] = require(`./${val}`);
  return acc;
}, {});
