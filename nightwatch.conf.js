module.exports = ((settings) => {
  // eslint-disable-next-line
  settings.test_workers = false;
  return settings;
})(require('./nightwatch.json'));
