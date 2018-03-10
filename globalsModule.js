const models = require('./server/models');
const chromedriver = require('chromedriver');

module.exports = {
  default: {
    launch_url: 'localhost:3000',
  },
  before: (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      chromedriver.start();
      done();
    }).catch((errors) => {
      done(errors);
    });
  },

  after: (done) => {
    chromedriver.stop();
    done();
  },
};
