import Review from '../models/review';

class ReviewService {
  constructor() {
    this.reviews = [];
  }

  addReview(reviewData) {
    const reviewConflicts = this.reviews.filter(review =>
      (review.title === reviewData.title &&
      (review.postedBy === reviewData.user || review.postedBy === 'anonymous user') &&
      review.review === reviewData.review)).length > 0;

    if (reviewConflicts) {
      return false;
    }
    const review = new Review(reviewData);
    this.reviews.push(review);
    return true;
  }

  getReviews(recipeId) {
    const reviews = this.reviews.filter(review => review.recipeId === recipeId);
    return reviews.length > 0 ? reviews : false;
  }
}

export default new ReviewService();
