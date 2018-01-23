import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import deepEqual from 'deep-equal';

import { recipeAction } from '../../actions/recipe';
import { fetchRecipeReviews } from '../../actions/reviews';
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
    if (this.props.recipeActionStatus.type === 'postReview' &&
      !nextProps.recipeActionStatus.error) {
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

  reviewSubmit = (event) => {
    event.preventDefault();
    const { reviewText } = this.state;
    if (reviewText.length === 0) {
      return;
    }
    const reviewPostData = {
      content: reviewText,
      rating: 5,
      recipeId: this.props.recipe.id,
    };
    this.props.recipeAction('postReview', reviewPostData);
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
  recipeActionStatus: state.recipes.recipeAction,
  reviews: state.reviews[ownProps.match.params.recipeId],
});

const mapDispatchToProps = dispatch => ({
  recipeAction: (actionType, recipeData) =>
    dispatch(recipeAction(actionType, recipeData)),
  fetchRecipeReviews: recipeId => dispatch(fetchRecipeReviews(recipeId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipeDetails);
