
const commands = {
  // eslint-disable-next-line
  fillForm: function(data) {
    return this
      .setValue('@titleField', data.title)
      .setValue('@descriptionField', data.description)
      .setValue('@ingredientsField', data.ingredients)
      .setValue('@directionsField', data.directions)
      .setValue('@imageField', data.image)
      .api.pause(2000);
  },
};

module.exports = {
  url: 'http://localhost:3000/recipes/create',
  elements: {
    addRecipeForm: { selector: '#create-recipe-component' },
    formTitle: { selector: '#create-recipe-component title' },
    titleField: { selector: 'input[name="title"]' },
    submitBtn: { selector: 'button#submit-recipe' },
    descriptionField: { selector: 'textarea[name="description"]' },
    ingredientsField: { selector: 'textarea[name="ingredients"]' },
    directionsField: { selector: 'textarea[name="directions"]' },
    imageField: { selector: 'input[name="images upload"]' },
  },
  commands: [commands],
};
