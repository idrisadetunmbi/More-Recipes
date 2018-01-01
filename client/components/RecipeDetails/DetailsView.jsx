import React, { PropTypes } from 'react';
import { showToast } from '../../utils';

const DetailsView = (props) => {

  const voteRecipe = (type) => {
    const {
      user, recipe, upvoteRecipe, history, downvoteRecipe,
    } = props;
    // if user is not signed in, redirect user to sign in
    if (!user.data.token) {
      history.push('/signin', {
        modal: true,
        previousLocation: history.location.pathname,
      });
      return;
    }
    if (user.data.id === recipe.authorId) {
      showToast(`You cannot ${type} a recipe you added`);
      return;
    }
    switch (type) {
      case 'upvote':
        upvoteRecipe(recipe.id);
        break;
      case 'downvote':
        downvoteRecipe(recipe.id);
        break;
      default:
        break;
    }
  };

  const { recipe, user } = props;
  return (
    <div className="recipe-details-component">
      <div className="container-section container">
        <div className="row" id="recipe-info">
          {/* recipe images and action buttons start */}
          <div className="col s12 l4 images-section">
            <h5 className="title">{recipe.title}</h5>
            <div className="divider" />
            {/* recipe author section */}
            <div id="recipe-author-section">
              <i className="material-icons">account_circle</i>
              <p>{recipe.author.username}</p>
            </div>
            <div>
              <div>
                <div className="recipe-main-img">
                  <img src={`${recipe.images[0]}`} alt={`${recipe.title} - main`} />
                </div>
                <div id="thumbnails-row" className="row">
                  {
                    // TODO: replace image sources
                    (recipe.images.slice(1).map((image, index) =>
                      <img className="col s6 thumbnails" src={image} alt={`thumbnail - ${index}`} />))
                  }
                </div>
              </div>

              {/* TODO: wire actions to onClicks of the action buttons */}
              <div>
                <div className="vote-actions">
                  <a
                    style={{ marginLeft: '0' }}
                    className="btn waves-ripple"
                    onClick={() => voteRecipe('upvote')}
                  >
                    <i className="material-icons">thumb_up</i>
                    <span>{recipe.upvotes}</span>
                  </a>
                  <a className="btn waves-ripple" onClick={() => voteRecipe('downvote')}>
                    <i className="material-icons">thumb_down</i>
                    <span>{recipe.downvotes}</span>
                  </a>
                  <a href="#" className="btn waves-ripple">
                    <i className="material-icons">favorite</i>
                    <span>{recipe.favorites}</span>
                  </a>
                </div>

                {/* <div id="favorites-icon" style={{ marginLeft: '0', marginTop: '2rem' }}>
                  <p style={{ WebkitMarginAfter: '0' }}>Rate and Review</p>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                  <a className="modal-trigger" href="#review-modal"><i className="material-icons">star</i></a>
                </div> */}
              </div>
            </div>
          </div>
          {/* recipe images and action buttons end */}

          <div style={{ marginLeft: '3rem' }} className="col s12 l7 description-section">
            <div>
              <h5>Description</h5>
              <p>{recipe.description}</p>
            </div>
            <div className="divider" />
            <div className="ingredients">
              <h5>Ingredients</h5>
              <ul>
                {
                  recipe.ingredients.split('\n').map((ingredient, i) =>
                    <li><i className="material-icons">chevron_right</i>{ingredient}</li>)
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
            <h5>Reviews</h5>
            {/* Reviews goes here */}
          </div>
        </div>
      </div>
      
      {
        user.data.token && user.data.id === recipe.authorId &&
        (
        <div className="fixed-action-btn">
          <a className="btn-floating btn-large">
            <i className="large material-icons">menu</i>
          </a>
          <ul>
            <li><a onClick={() => props.deleteRecipe(recipe.id)} className="btn-floating red"><i className="material-icons">delete</i></a></li>
            <li><a onClick={props.toggleViewMode} className="btn-floating yellow darken-1"><i className="material-icons">edit</i></a></li>
          </ul>
        </div>
        )
      }
    </div>
  );
};

export default DetailsView;
