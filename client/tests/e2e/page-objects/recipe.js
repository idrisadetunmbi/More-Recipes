import { testRecipe } from '../../__mocks__/e2e';

const commands = {
  // eslint-disable-next-line
  clickVoteBtn: function(voteType) {
    return this.click(`@${voteType}Btn`);
  },
};

module.exports = {
  url: 'http://localhost:3000/catalog',
  elements: {
    container: { selector: '#recipe-details-component' },
    recipeTitle: { selector: '.images-section h5' },
    recipeImage: { selector: `img[src="${testRecipe.images[0]}"]` },
    upvoteBtn: { selector: '.vote-actions a:nth-of-type(1)' },
    downvoteBtn: { selector: '.vote-actions a:nth-of-type(2)' },
    favoriteBtn: { selector: '.vote-actions a:nth-of-type(3)' },
    reviewsSectionTitle: { selector: '#review-section h5' },
    emptyReviewsText: { selector: '#no-review-text' },
    reviewInputField: { selector: '#review-form textarea' },
    reviewSubmitBtn: { selector: '#review-form button' },
    newReviewDetails: { selector: '.review-details' },
    newReviewText: { selector: 'p.review-text' },
    recipeActionsBtn: { selector: 'a.btn-floating.btn-large' },
    editRecipeBtn: { selector: 'a.btn-floating.yellow.darken-1' },
  },
  commands: [commands],
};
