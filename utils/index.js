const utils = [
  'randBetween',
  'msToMin',
  'newHorseman'
];

module.exports = utils.reduce((acc, val) => {
  acc[val] = require(`./${val}`);
  return acc;
}, {});
