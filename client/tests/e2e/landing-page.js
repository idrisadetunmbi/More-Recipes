/* eslint-disable no-unused-expressions */
import models from '../../../server/models';
import { user, testRecipe } from '../__mocks__/e2e';

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
  'Landing Page': (browser) => {
    const landingPage = browser.page.landing();
    landingPage.navigate();

    // verify navbar is visible
    landingPage.expect.section('@navBar').to.be.visible;

    // verify brand logo is visible
    const navBarSection = landingPage.section.navBar;
    navBarSection.expect.section('@brandLogo').to.be.visible;

    // verify brand logo contains expected elements
    const { brandLogo } = navBarSection.section;
    brandLogo.expect.element('@image').to.be.present;
    brandLogo.expect.element('@title').to.be.present;
    brandLogo.expect.element('@title').text.to.equal('MoreRecipes');

    // verify banner section is visible
    landingPage.expect.section('@banner').to.be.visible;
    browser.pause(2000);
    landingPage.click('@browseCatalog');
    browser.pause(2500);

    // test clicking the view catalog button changes the url to the catalog page
    landingPage.click('@viewCatalog').assert.urlEquals('http://localhost:3000/catalog');
    browser.pause(2000);
    browser.end();
  },
};
