export default class Recipe {
  constructor(reqBody) {
    this.title = reqBody.title;
    this.description = reqBody.description;
    this.ingredients = reqBody.ingredients;
    this.directions = reqBody.directions;
    this.upvotes = 0;
    this.downvotes = 0;
    this.downvotes = 0;
    this.category = reqBody.category || '';
  }
}
