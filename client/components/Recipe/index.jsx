import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const RecipeCard = (props) => {
  const { recipe, gridStyle } = props;
  return (
    <div id="recipe-card-component" className={`col ${gridStyle}`}>
      <div className="card">
        <div className="card-image">
          <img src={`${recipe.images[0]}`} alt={recipe.title} />
        </div>
        <div className="card-content">
          <span className="card-title">{recipe.title}</span>
          <p>{recipe.description}</p>
        </div>
        <div className="card-action">
          <span><i className="material-icons">thumb_up</i>{recipe.upvotes}</span>
          <span><i className="material-icons">thumb_down</i>{recipe.downvotes}</span>
          <span><i className="material-icons">favorite</i>{recipe.favorites}</span>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape().isRequired,
  gridStyle: PropTypes.string.isRequired,
};

export default RecipeCard;
