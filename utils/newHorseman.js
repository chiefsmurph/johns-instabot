const Horseman = require("node-horseman");

const newHorseman = () => {
  return new Horseman({
    timeout: 8000
  })
    .viewport(1500,700);
    // .zoom(2);
};

module.exports = newHorseman;
