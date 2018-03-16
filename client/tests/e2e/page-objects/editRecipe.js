module.exports = {
  url: 'http://localhost:3000/recipes/create',
  elements: {
    container: { selector: '.recipe-details-component' },
    titleField: { selector: 'textarea[name="title"]' },
    submitBtn: { selector: 'div.fixed-action-btn:nth-of-type(2) a' },
    imageField: { selector: 'input[name="images upload"]' },
  },
};
