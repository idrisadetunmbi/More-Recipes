/* eslint-disable no-unused-expressions */
import { recipe, user, testRecipe } from '../__mocks__/e2e';
import models from '../../../server/models';

const ADD_RECIPE_FAILURE_MSG = 'error creating recipe';

module.exports = {
  before: async (browser, done) => {
    try {
      await models.sequelize.sync({ force: true });
      const testUser = await models.user.create(user.testUser);
      await models.user.create(user.signUpData);
      await models.recipe.create({
        ...testRecipe,
        authorId: testUser.id,
      });
      done();
    } catch (error) {
      done(error);
    }
  },

  'Create Recipe flow': (browser) => {
    const catalogPage = browser.page.catalog();
    const signInPage = browser.page.signIn();
    const createRecipePage = browser.page.addRecipe();

    catalogPage.navigate();
    catalogPage.click('@addRecipeBtn');
    browser.pause(2000);
    signInPage.expect.element('@signInForm').to.be.visible;
    signInPage.fillFormAndSubmit(user.testUser);
    browser.pause(2000);

    catalogPage.click('@addRecipeBtn');
    browser.pause(2000);
    browser.assert.urlEquals(createRecipePage.url);
    createRecipePage.expect.element('@addRecipeForm').to.be.visible;
    createRecipePage.fillForm(recipe);
    browser.pause(2000);
    browser.moveToElement('button[type="submit"]', 500, 500);
    browser.pause(1000);
    browser.click('button[type="submit"]');
    browser.pause(8000);

    browser.assert.urlEquals(catalogPage.url);
  },

  'User cannot create a recipe with the same title': (browser) => {
    const catalogPage = browser.page.catalog();
    const createRecipePage = browser.page.addRecipe();

    catalogPage.click('@addRecipeBtn');
    browser.pause(2000);
    browser.assert.urlEquals(createRecipePage.url);
    createRecipePage.expect.element('@addRecipeForm').to.be.visible;
    createRecipePage.fillForm(recipe);
    browser.pause(2000);
    browser.click('button[type="submit"]');
    browser.expect.element('body').text.to
      .contain(ADD_RECIPE_FAILURE_MSG).after(5000);
    browser.pause(4000);
    browser.end();
  },
};
