/* eslint-disable no-unused-expressions */

module.exports = {
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

    // test clicking the view catalog button changes the url to the catalog page
    landingPage.click('@viewCatalog').assert.urlEquals('http://localhost:3000/catalog');
    browser.end();
  },
};
