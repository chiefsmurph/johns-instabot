const Horseman = require("node-horseman");

const newHorseman = () => {
  return new Horseman({
    ignoreSSLErrors: true,
    timeout: 60000
  })
    .viewport(1500,700);
    // .zoom(2);
};

module.exports = newHorseman;
