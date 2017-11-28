import { connect } from 'react-redux';
import RecipeListComponent from '../RecipeList';
import { fetchRecipes } from '../../actions/recipes';

const mapStateToProps = (state) => {
  return {
    recipes: state.recipes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRecipes: () => dispatch(fetchRecipes()),
  };
};

const RecipeList = connect(mapStateToProps, mapDispatchToProps)(RecipeListComponent);

export default RecipeList;
