
const commands = {
  // eslint-disable-next-line
  fillFormAndSubmit: function(data) {
    return this.waitForElementVisible('@usernameInput', 500)
      .setValue('@usernameInput', data.username)
      .setValue('@passwordInput', data.password)
      .click('@submitBtn')
      .api.pause(2000);
  },
};

module.exports = {
  url: 'localhost:3000/signin',
  elements: {
    signInForm: {
      selector: '.auth-component',
    },
    usernameInput: { selector: 'input[name="username"]' },
    passwordInput: { selector: 'input[name="password"]' },
    submitBtn: { selector: '#form-submit' },
    signUpLink: { selector: 'a[href="/signup"]' },
    signInError: {
      selector: "//*[contains(text(),'wrong username or password')]",
      locateStrategy: 'xpath',
    },
  },
  commands: [commands],
};
