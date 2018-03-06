import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Recipe from '../Recipe';
import { LoaderWithComponent } from '../reusables';

export const RecipeList = (props) => {
  const { recipes, isLoadingRecipes, error } = props;
  const { style, gridStyle } = props;
  return (
    <LoaderWithComponent
      showLoader={isLoadingRecipes}
      component={
        <div className="row" id="recipe-gallery" style={style}>
          {
            // eslint-disable-next-line
            error ?
              <div className="center">There was an error loading recipes - {error.error}</div> :
              recipes && recipes.length ?
                recipes.map(recipe =>
                  (
                    <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                      <Recipe gridStyle={gridStyle} recipe={recipe} />
                    </Link>)) :
                (<p className="center">There are no recipes in this category</p>)
          }
        </div>
      }
    />
    // isLoadingRecipes ?
  );
};

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf().isRequired,
  isLoadingRecipes: PropTypes.bool.isRequired,
  error: PropTypes.shape().isRequired,
  style: PropTypes.shape().isRequired,
  gridStyle: PropTypes.string.isRequired,
};

export default RecipeList;
