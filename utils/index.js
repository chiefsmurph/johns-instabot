const utils = [
  'randBetween',
  'msToMin'
];

module.exports = utils.reduce((acc, val) => {
  acc[val] = require(`./${val}`);
  return acc;
}, {});
