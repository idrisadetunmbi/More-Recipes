import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'deep-equal';

import { recipeAction, recipeVoteAction } from '../../actions/recipe';
import { fetchRecipeReviews, postRecipeReview } from '../../actions/reviews';
import './index.scss';
import DetailsView from './DetailsView';
import EditView from './EditView';

// TODO: add more props as might be required
class RecipeDetails extends React.Component {
  state = {
    isDetailsMode: true,
    reviewText: '',
  }

  componentWillMount() {
    this.props.fetchRecipeReviews(this.props.recipe.id);
  }

  componentWillReceiveProps(nextProps) {
    // if recipe has been updated and view mode is in edit mode
    if (
      !deepEqual(nextProps.recipe, this.props.recipe) &&
      !this.state.isDetailsMode
    ) {
      this.toggleViewMode();
    }
    if (!deepEqual(nextProps.reviews, this.props.reviews)) {
      this.setState({
        reviewText: '',
      });
    }
  }

  reviewOnChange = (event) => {
    this.setState({
      reviewText: event.target.value,
    });
  }

  reviewSubmit = () => {
    const { reviewText } = this.state;
    const { user, history } = this.props;
    if (reviewText.length === 0) {
      return;
    }
    if (!user.data.token) {
      history.push('/signin', {
        modal: true,
        previousLocation: history.location.pathname,
      });
      return;
    }
    const reviewData = {
      content: reviewText,
      rating: 5,
    };
    this.props.postRecipeReview(this.props.recipe.id, reviewData);
  }

  toggleViewMode = () => {
    this.setState({ isDetailsMode: !this.state.isDetailsMode });
  }

  render() {
    const { recipe, user, history } = this.props;
    if (!recipe) {
      history.replace('/catalog');
      return null;
    }
    return (this.state.isDetailsMode ?
      <DetailsView
        {...this.props}
        toggleViewMode={this.toggleViewMode}
        reviewText={this.state.reviewText}
        reviewOnChange={this.reviewOnChange}
        reviewSubmit={this.reviewSubmit}
      /> :
      <EditView {...this.props} toggleViewMode={this.toggleViewMode} />
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  recipe: state.recipes.recipes
    .filter(recipe => recipe.id === ownProps.match.params.recipeId)[0],
  user: state.user,
  reviews: state.reviews[ownProps.match.params.recipeId],
});

const mapDispatchToProps = dispatch => ({
  recipeAction: (actionType, recipeData) =>
    dispatch(recipeAction(actionType, recipeData)),

  fetchRecipeReviews: recipeId => dispatch(fetchRecipeReviews(recipeId)),

  postRecipeReview: (recipeId, reviewData) =>
    dispatch(postRecipeReview(recipeId, reviewData)),

  recipeVoteAction: (actionType, recipeId) =>
    dispatch(recipeVoteAction(actionType, recipeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetails);
