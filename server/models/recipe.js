import uuid from 'uuid';

export default class Recipe {
  constructor(reqBody) {
    this.id = uuid.v4();
    this.title = reqBody.title;
    this.description = reqBody.description;
    this.ingredients = reqBody.ingredients;
    this.directions = reqBody.directions;
    this.upvotes = 0;
    this.downvotes = 0;
    this.favorites = 0;
    this.category = reqBody.category || '';
  }
}
