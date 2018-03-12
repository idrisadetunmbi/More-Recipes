/* eslint-disable no-unused-expressions */
import models from '../../../server/models';

const SUCCESS_SIGNIN_TEXT = 'You are now signed in!!!';
const mocks = {
  signUpData: {
    username: 'newusername',
    password: 'password',
    email: 'xyz@mail.com',
  },
  invalidUserData: {

  },
};
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

const signUpTestUser = (browser) => {
  loadSignUpPage(browser);
  const signUpPage = browser.page.signUp();
  signUpPage.fillFormAndSubmit(mocks.signUpData);
  clickSignOutLink(browser);
};

module.exports = {
  beforeEach: (browser, done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    }).catch((error) => { done(error); });
  },

  'User can sign in successfully': (browser) => {
    signUpTestUser(browser);
    browser.pause(2000);

    browser.click('a[href="/signin"]');
    const signInPage = browser.page.signIn();
    signInPage.expect.element('@signInForm').to.be.visible;
    signInPage.fillFormAndSubmit({
      username: mocks.signUpData.username,
      password: mocks.signUpData.password,
    });
    browser.assert.containsText('body', SUCCESS_SIGNIN_TEXT);
    browser.end();
  },

  'User cannot sign in with wrong password': (browser) => {
    signUpTestUser(browser);

    browser.click('a[href="/signin"]');
    const signInPage = browser.page.signIn();
    signInPage.fillFormAndSubmit({
      username: mocks.signUpData.username,
      password: 'wrong password',
    });

    signInPage.expect.element('@signInError').to.be.visible;
    browser.end();
  },

  'User cannot sign in with unregistered details': (browser) => {
    browser.url('localhost:3000').click('a[href="/signin"]');
    const signInPage = browser.page.signIn();
    signInPage.fillFormAndSubmit({
      username: 'unregistered',
      password: 'wrong password',
    });
    signInPage.expect.element('@signInError').to.be.visible;
    browser.end();
  },
};
