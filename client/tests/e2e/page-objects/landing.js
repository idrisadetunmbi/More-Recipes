module.exports = {
  url: 'localhost:3000',
  elements: {
    viewCatalog: {
      selector: "//*[contains(text(),'view entire catalog')]",
      locateStrategy: 'xpath',
    },
    browseCatalog: {
      selector: "//a[contains(text(),'Browse Catalog')]",
      locateStrategy: 'xpath',
    },
  },
  sections: {
    navBar: {
      selector: '#navbar-component',
      elements: {
        signOutLink: {
          selector: '#sign-out',
        },
      },
      sections: {
        brandLogo: {
          selector: '.brand-logo',
          elements: {
            image: 'img',
            title: 'h5',
          },
        },
        rightMenu: {
          selector: '#navbar-component .right',
          elements: {
            signInLink: 'a[href="/signin"]',
          },
        },
      },
    },
    banner: {
      selector: '#index-banner',
      elements: {
        bannerHeaderText: 'h1',
        bannerDescriptionText: 'h5',
        browseCatalogBtn: '#btn-browse-catalog',
      },
    },
  },
};
