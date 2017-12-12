import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { recipeAction } from '../../actions/recipe';
import './index.css';

// TODO: add more props as might be required
const RecipeDetails = (props) => {

  const { recipe, user } = props;
  if (!recipe) {
    props.history.goBack();
    return null;
  }
  return (
    <div>
      <div className="container-section container">
        <div className="row" id="recipe-info">
          {/* recipe images and action buttons start */}
          <div className="col s12 l4 images-section">
            <h5 className="title">{recipe.title}</h5>
            <div className="divider" style={{}} />
            {/* recipe author section */}
            <div>
              <i style={{ fontSize: '4rem', margin: '1rem', color: '#444' }} className="material-icons">account_circle</i>
              <p style={{ display: 'inline-block', verticalAlign: 'top' }} >{recipe.author.username}</p>
            </div>
            <div>
              <div>
                <div className="recipe-main-img">
                  <img src={`${recipe.images[0]}`} alt={`${recipe.title} - main`} style={{ width: '100%', maxHeight: '250px' }} />
                </div>
                <div className="thumbnails row">
                  {
                    // TODO: replace image sources
                    (recipe.images.slice(1).map((image, index) =>
                      <img className="col s6 thumbnails" src="" alt={`thumbnail - ${index}`} />))
                  }
                </div>
              </div>

              {/* TODO: wire actions to onClicks of the action buttons */}
              <div>
                <div className="vote-actions">
                  <a style={{ marginLeft: '0' }} href="." className="btn waves-ripple"><i className="material-icons">thumb_up</i><span>{recipe.upvotes}</span></a>
                  <a href="." className="btn waves-ripple"><i className="material-icons">favorite</i><span>{recipe.favorites}</span></a>
                </div>

                <div id="favorites-icon" style={{ marginLeft: '0', marginTop: '2rem' }}>
                  <p style={{ WebkitMarginAfter: '0', fontSize: '18px', marginLeft: '.2rem' }}>Rate and Review</p>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                </div>
              </div>
            </div>
          </div>
          {/* recipe images and action buttons end */}

          <div style={{ marginLeft: '3rem', marginTop: '3rem' }} className="col s12 l7 description-section">
            <div>
              <h5>Description</h5>
              <p>{recipe.description}</p>
            </div>
            <div className="divider" />
            <div className="ingredients">
              <h5>Ingredients</h5>
              <ul>
                {
                  recipe.ingredients.split('\n').map((ingredient, i) => <li><i className="material-icons">chevron_right</i>{ingredient}</li>)
                }
              </ul>
            </div>
            <div className="divider" />
            <div className="directions">
              <h5>Directions</h5>
              <ol>
                {
                  recipe.directions.split('\n').map((direction, i) => <li><p>{direction}</p></li>)
                }
              </ol>
            </div>
          </div>
        </div>
        {/* recipe details end */}

        {/* review section */}
        <div className="divider" />
        <div id="review-section">
          <div className="row">
            <h5 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem', fontFamily: 'Raleway', fontStyle: 'normal' }} >Reviews</h5>
            {/* Reviews goes here */}
          </div>
        </div>
      </div>
      
      {
        user.data.id === recipe.authorId &&
        (
        <div className="fixed-action-btn">
          <a className="btn-floating btn-large">
            <i className="large material-icons">menu</i>
          </a>
          <ul>
            <li><a onClick={() => props.deleteRecipe(recipe.id)} className="btn-floating red"><i className="material-icons">delete</i></a></li>
            <li><a className="btn-floating yellow darken-1"><i className="material-icons">edit</i></a></li>
          </ul>
        </div>
        )
      }
    </div>
  );
};

// RecipeDetails.propTypes = {
//   recipe: PropTypes.objectOf().isRequired,
// };

const mapStateToProps = (state, ownProps) => {
  return {
    recipe: state.recipes.recipes.filter(recipe => recipe.id === ownProps.match.params.recipeId)[0],
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteRecipe: recipeId => dispatch(recipeAction('delete', recipeId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetails);
