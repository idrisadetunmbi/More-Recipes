import React from 'react';
import { Link } from 'react-router-dom';

import Recipe from '../Recipe';

export const RecipeList = (props) => {
  const { recipes, isLoadingRecipes, error } = props;
  const { style, gridStyle } = props;
  return (
    isLoadingRecipes ?
      <div>Loading Recipes...</div> :
      <div className="row" id="recipe-gallery" style={style}>
        {
          // eslint-disable-next-line
          error ?
            <div className="center">There was an error loading recipes - {error.error}</div> :
            recipes.length ?
              recipes.map(recipe =>
               (
                 <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                   <Recipe gridStyle={gridStyle} recipe={recipe} />
                 </Link>)) :
               (<p>There are no recipes in this category</p>)
        }
      </div>
  );
};


export default RecipeList;
