import uuid from 'uuid';

export default class RecipeReview {
  constructor(reviewData) {
    this.id = uuid.v4();
    this.title = reviewData.title || '';
    this.review = reviewData.review;
    this.postedBy = reviewData.user || 'anonymous user';
    this.recipeId = reviewData.recipeId;
  }
}
