import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';


import Recipe from '../Recipe';

export default class RecipeList extends Component {
  componentWillMount() {
    this.props.fetchRecipes();
  }

  render() {
    const { recipes, isFetching, error } = this.props.recipes;
    return (
      isFetching ?
        <div>Loading Recipe</div> :
        <div className="row" style={{ width: '90%' }}>
          {
            error ?
              <div className="center">There was an error loading recipes - {error.error}</div> :
              recipes.map(recipe =>
                  <Link to="/recipes/:recipeId"><Recipe key={recipe.id} recipe={recipe} /></Link>)
          }
        </div>
    );
  }
}

