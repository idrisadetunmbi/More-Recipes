module.exports = {
  'Demo test Google': (browser) => {
    browser
      .url('localhost:3000')
      .waitForElementVisible('body', 1000)
      .useXpath()
      .waitForElementVisible("//*[contains(text(),'view entire catalog')]", 1000)
      .click("//*[contains(text(),'view entire catalog')]")
      .useCss()
      .waitForElementVisible('#main-divider', 1000)
      .pause(10000)
      .end();
  },
};
