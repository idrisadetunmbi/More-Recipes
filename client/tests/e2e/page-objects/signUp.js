
const commands = {
  // eslint-disable-next-line
  fillFormAndSubmit: function(data) {
    return this.waitForElementVisible('@usernameInput', 1000)
      .setValue('@usernameInput', data.username)
      .setValue('@passwordInput', data.password)
      .setValue('@emailInput', data.email)
      .setValue('@passwordConfirmInput', data.password)
      .click('@submitBtn')
      .api.pause(2000);
  },
};

module.exports = {
  url: 'localhost:3000',
  elements: {
    formComponent: { selector: '.auth-component' },
    usernameInput: { selector: 'input[name="username"]' },
    emailInput: { selector: 'input[type="email"]' },
    passwordInput: { selector: 'input[name="password"]' },
    passwordConfirmInput: { selector: 'input[name="passwordConfirm"]' },
    submitBtn: { selector: '#form-submit' },
    signInLink: { selector: 'a[href="/signin"]' },
    usernameChosen: {
      selector: "//*[contains(text(),'username has been taken')]",
      locateStrategy: 'xpath',
    },
    emailChosen: {
      selector: "//*[contains(text(),'this email is already registered')]",
      locateStrategy: 'xpath',
    },
  },
  commands: [commands],
};
