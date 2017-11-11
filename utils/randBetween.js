const randBetween = (low, high) => {
  return low + Math.round(Math.random() * (high - low));
};

// this is boundary inclusive ie randBetween(1, 4) can equal 1, 2, 3 or 4

module.exports = randBetween;
