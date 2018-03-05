const chromedriver = require('chromedriver');

module.exports = {
  default: {
    launchUrl: 'localhost:3000/catalog',
  },
  before: (done) => {
    chromedriver.start();
    done();
  },

  after: (done) => {
    chromedriver.stop();
    done();
  },
};
