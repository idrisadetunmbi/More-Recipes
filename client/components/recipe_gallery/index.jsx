import React, { Component } from 'react';
import axios from 'axios';

import Recipe from '../recipe';

export default class RecipeGallery extends Component {
  state = {
    recipes: null,
    error: null,
    isLoadingRecipes: true,
  }

  // eslint-disable-next-line
  getRecipes = async () => {
    let recipes;
    try {
      const response = await axios.get('/api/v1/recipes/');
      recipes = response.data.data;
    } catch (error) {
      console.log(error.response.data);
      this.setState({
        error: error.response.data,
      });
    }
    return recipes;
  }

  setFetchedRecipes = (recipes) => {
    this.setState({
      recipes,
      isLoadingRecipes: false,
    });
  }

  async componentDidMount() {
    const recipes = await this.getRecipes();
    this.setFetchedRecipes(recipes);
  }

  render() {
    const { recipes, isLoadingRecipes } = this.state;
    return (
      isLoadingRecipes ?
        <div>Loading Recipe</div> :
        <div className="row center">
          {recipes.map(recipe => <Recipe key={recipe.id} recipe={recipe} />)}
        </div>
    );
  }
}

