/* eslint-disable no-unused-expressions */
import models from '../../../server/models';
import { user as mocks } from '../__mocks__/e2e';

const SUCCESS_SIGNUP_TEXT = 'You have signed up successfully!!!';
const loadSignUpPage = (browser) => {
  browser.url('localhost:3000')
    .click('a[href="/signin"]')
    .click('a[href="/signup"]');
};

const clickSignOutLink = (browser) => {
  const { navBar } = browser.page.landing().section;
  navBar.click('#navbar-component .right');
  browser.pause(1000);
  navBar.click('@signOutLink');
};

module.exports = {
  beforeEach: (browser, done) => {
    models.sequelize.sync({ force: true }).then(() => {
      loadSignUpPage(browser);
      done();
    }).catch((error) => { done(error); });
  },

  'User can sign up successfully': (browser) => {
    const signUpPage = browser.page.signUp();
    signUpPage.expect.element('@formComponent').to.be.visible;
    signUpPage.fillFormAndSubmit(mocks.signUpData);

    browser.assert.containsText('body', SUCCESS_SIGNUP_TEXT);
    browser.assert.urlEquals('http://localhost:3000/catalog');
    browser.assert.containsText('body', mocks.signUpData.username);
    browser.end();
  },

  'User cannot sign up with a registered username': (browser) => {
    const signUpPage = browser.page.signUp();
    signUpPage.fillFormAndSubmit(mocks.signUpData);

    clickSignOutLink(browser);
    loadSignUpPage(browser);
    signUpPage.fillFormAndSubmit(mocks.signUpData);

    signUpPage.expect.element('@usernameChosen').to.be.visible;
    browser.end();
  },

  'User cannot sign up with a registered email': (browser) => {
    const signUpPage = browser.page.signUp();
    signUpPage.fillFormAndSubmit(mocks.signUpData);

    clickSignOutLink(browser);
    loadSignUpPage(browser);
    signUpPage.fillFormAndSubmit(mocks.dataWithRegisteredEmail);

    signUpPage.expect.element('@emailChosen').to.be.visible;
    browser.end();
  },
};
