const randBetween = (low, high) => {
  return low + Math.round(Math.random() * (high - low));
};

module.exports = randBetween;
