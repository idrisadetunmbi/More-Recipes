module.exports = {
  url: 'http://localhost:3000/catalog',
  elements: {
    container: { selector: '#catalog-component' },
    searchInput: { selector: 'input[type="search"]' },
    addRecipeBtn: { selector: 'div.fixed-action-btn a' },
    catalogTitle: {
      selector: "//*[contains(text(),'Featured Recipes')]",
      locateStrategy: 'xpath',
    },
    recipe: { selector: 'div#recipe-card-component' },
    clearSearchBtn: { selector: '#clear-search' },
    searchTitle: {
      selector: '//h5[contains(text(), "Search Results")]',
      locateStrategy: 'xpath',
    },
  },
};
