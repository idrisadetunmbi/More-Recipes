/* eslint-disable no-unused-expressions */
import models from '../../../server/models';
import { user, testRecipe } from '../__mocks__/e2e';

const EDIT_RECIPE_SUCCESS_MSG = 'Recipe has been successfully updated';
const newRecipeTitle = 'a new title for this recipe';

module.exports = {
  before: async (browser, done) => {
    try {
      await models.sequelize.sync({ force: true });
      const testUser = await models.user.create(user.testUser);
      await models.recipe.create({
        ...testRecipe,
        authorId: testUser.id,
      });
      done();
    } catch (error) {
      done(error);
    }
  },

  'Edit recipe': (browser) => {
    const catalogPage = browser.page.catalog();
    const recipePage = browser.page.recipe();
    const signInPage = browser.page.signIn();
    const editRecipePage = browser.page.editRecipe();

    catalogPage.navigate();
    browser.pause(2000);
    catalogPage.click('@recipe');
    browser.pause(2000);
    browser.click('a[href="/signin"]');
    browser.pause(1000);
    signInPage.expect.element('@signInForm').to.be.visible;
    signInPage.fillFormAndSubmit(user.testUser);
    recipePage.expect.element('@recipeActionsBtn').to.be.visible;
    recipePage.click('@recipeActionsBtn');
    browser.pause(500);
    recipePage.click('@editRecipeBtn');
    browser.pause(2000);

    editRecipePage.expect.element('@titleField').to.be.present;
    editRecipePage.expect.element('@submitBtn').to.be.present;
    browser.pause(1000);
    editRecipePage.clearValue('@titleField');
    browser.pause(1000);
    editRecipePage.setValue('@titleField', newRecipeTitle);
    browser.pause(2000);
    editRecipePage.click('@submitBtn');
    browser.expect.element('body').text.to
      .contain(EDIT_RECIPE_SUCCESS_MSG).after(2000);
    recipePage.expect.element('@recipeTitle').text.to.equal(newRecipeTitle);
    browser.pause(2000);
    browser.end();
  },
};
