/* eslint-disable no-unused-expressions */
import models from '../../../server/models';
import { user, testRecipe } from '../__mocks__/e2e';

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

  'Catalog page and search recipe': (browser) => {
    const catalogPage = browser.page.catalog();
    catalogPage.navigate();
    browser.maximizeWindow();
    catalogPage.expect.element('@recipe').to.be.present;
    catalogPage.expect.element('@catalogTitle').to.be.present;
    catalogPage.expect.element('@container').to.be.present;
    catalogPage.expect.element('@searchInput').to.be.present;
    catalogPage.expect.element('@addRecipeBtn').to.be.present;
    browser.pause(3000);

    catalogPage.setValue('@searchInput', [testRecipe.title, browser.Keys.ENTER]);
    browser.pause(2000);
    catalogPage.expect.element('@clearSearchBtn').to.be.visible;
    catalogPage.expect.element('@searchTitle').to.be.visible;
    catalogPage.expect.element('@searchTitle').text.to.contain(testRecipe.title);
    browser.pause(2000);
    catalogPage.click('@recipe');
    browser.pause(3000);
  },

  'Recipe page and actions': (browser) => {
    const recipePage = browser.page.recipe();
    const signInPage = browser.page.signIn();

    recipePage.expect.element('@recipeTitle').to.be.present;
    recipePage.expect.element('@recipeImage').to.be.present;
    recipePage.expect.element('@recipeTitle').text.to.contain(testRecipe.title);
    recipePage.clickVoteBtn('upvote');
    recipePage.expect.element('@upvoteBtn').text.to.contain(0);
    browser.pause(2000);

    signInPage.expect.element('@signInForm').to.be.visible.after(2000);
    signInPage.fillFormAndSubmit(user.signUpData);
    recipePage.clickVoteBtn('upvote');
    browser.pause(2000);
    recipePage.expect.element('@upvoteBtn').text.to.contain(1);
    recipePage.clickVoteBtn('downvote');
    recipePage.expect.element('@upvoteBtn').text.to.contain(0).after(2000);
    recipePage.expect.element('@downvoteBtn').text.to.contain(1).after(2000);
    recipePage.clickVoteBtn('favorite');
    recipePage.expect.element('@favoriteBtn').text.to.contain(1).after(2000);
    browser.pause(2000);
    recipePage.expect.element('@reviewsSectionTitle').to.be.present;
    recipePage.expect.element('@reviewsSectionTitle').text.to.contain('Reviews');
    recipePage.expect.element('@emptyReviewsText').to.be.present;
    recipePage.setValue('@reviewInputField', 'great recipe');
    browser.pause(2000);
    recipePage.click('@reviewSubmitBtn');
    browser.pause(2000);
    recipePage.expect.element('@newReviewDetails').to.be.present;
    recipePage.expect.element('@newReviewText').to.be.present;
    recipePage.expect.element('@newReviewText').text.to.contain('great recipe');
    browser.end();
  },
};
