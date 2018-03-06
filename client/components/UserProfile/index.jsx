import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserAvatar from '../RecipeDetails/avatar_img.png';
import RecipeList from '../RecipeList';
import { sendImageToCloudinary, showToast } from '../../utils';
import './index.scss';
import Logo from '../NavBar/logo.jpg';

import {
  fetchUserRecipes,
  fetchUserFavorites,
  updateUserProfilePhoto,
} from '../../actions/user';

/**
 * @class UserProfile
 * @extends {Component}
 */
class UserProfile extends Component {
  state = {
    myRecipeTabIsActive: true,
    uploadingUserImage: false,
  }

  /**
   * @returns {void}
   * @memberOf UserProfile
   */
  componentWillMount() {
    this.props.fetchUserRecipes();
  }

  /**
   * @returns {void}
   * @memberOf UserProfile
   */
  componentDidMount() {
    // initialize materialize tabs
    $('ul.tabs').tabs();
  }

  /**
   * @param {Object} nextProps - component props
   *
   * @returns {void}
   * @memberOf UserProfile
   */
  componentWillReceiveProps(nextProps) {
    // if the user signs out on user's profile page
    if (Object.keys(nextProps.userData).length === 0) {
      this.props.history.replace('/catalog');
    }
  }

  /**
   * @param {Object} event - DOM Event
   *
   * @returns {void}
   * @memberOf UserProfile
   */
  onChangeImageInput = async (event) => {
    this.setState(() => ({ uploadingUserImage: true }));
    let response;
    try {
      response = await sendImageToCloudinary(event.target.files[0]);
    } catch (error) {
      showToast(`An error occured while uploading image - ${error.message}`);
      this.setState(() => ({ uploadingUserImage: false }));
      return;
    }
    const uploadedImageUrl = response.data.secure_url;
    this.props.updateUserProfilePhoto(uploadedImageUrl);
    this.setState(() => ({ uploadingUserImage: false }));
  }

  userNameAndRecipeCounts = () => {
    const { userData, userRecipes, userFavorites } = this.props;
    return (
      <div>
        <h5 className="title">{`@${userData.username}`}</h5>
        <div id="recipes-count">
          <span>
            <img title="Number of recipes" src={Logo} alt="" />
            <span className="recipes-count">
              {userRecipes && userRecipes.length}
            </span>
          </span>
          <span className="recipes-count">
            <i className="material-icons">favorite</i>
            <span>{userFavorites && userFavorites.length}</span>
          </span>
        </div>
        <div className="divider" />
      </div>
    );
  }

  renderAddRecipeButton = () => (
    this.state.myRecipeTabIsActive &&
    <div className="fixed-action-btn">
      <a
        className="btn-floating btn-large"
        onClick={() => {
          this.props.history.push('/recipes/create', {
            modal: true,
            previousLocation: this.props.history.location.pathname,
          });
        }}
      >
        <i className="material-icons">add</i>
      </a>
    </div>
  )

  renderUserImage = () => (
    <div id="user-image">
      <img
        className="responsive-img"
        src={this.props.userData.imageUrl || UserAvatar}
        alt="userprofilepic"
      />
      {
        this.state.uploadingUserImage ?
          <div className="progress"><div className="indeterminate" /></div> :
          <div id="image-update-btn" className="input-field file-field">
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={this.onChangeImageInput}
            />
            Change Profile Photo
          </div>
      }
    </div>
  )

  renderTabs = () => (
    <div className="row">
      <div className="col s12">
        <ul className="tabs">
          <li className="tab col s3">
            <a
              href=""
              onClick={() =>
                this.setState({ myRecipeTabIsActive: true })}
              className="black-text"
            >My Recipes
            </a>
          </li>
          <li className="tab col s3 black-text">
            <a
              href=""
              onClick={() => {
                this.setState({ myRecipeTabIsActive: false });
                this.props.fetchUserFavorites();
              }}
              className="black-text"
            >Favorites
            </a>
          </li>
        </ul>
      </div>
    </div>
  )

  renderRecipes = () =>
    this.state.myRecipeTabIsActive ?
      <RecipeList
        recipes={this.props.userRecipes}
        gridStyle="l6 m12 s12"
        isLoadingRecipes={!this.props.userRecipes}
      />
      :
      <RecipeList
        recipes={this.props.userFavorites}
        gridStyle="l6 m12 s12"
        isLoadingRecipes={!this.props.userFavorites}
      />;

  /**
   * @returns {JSX.Element} - DOM Element
   *
   * @memberOf UserProfile
   */
  render() {
    return (
      <div className="container" id="user-profile-component">
        <div className="row">
          <div className="col m4 s12 l4 center" id="user-info">
            {this.renderUserImage()}
            {this.userNameAndRecipeCounts()}
          </div>

          <div className="col l7 m7 offset-m1 offset-l1 s12">
            {this.renderTabs()}
            {this.renderRecipes()}
          </div>
        </div>
        {this.renderAddRecipeButton()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userRecipes: state.user.recipes &&
    state.recipes.recipes.filter(recipe =>
      state.user.recipes.includes(recipe.id)),

  userFavorites: state.user.favoriteRecipes
    && state.recipes.recipes.filter(recipe =>
      state.user.favoriteRecipes.includes(recipe.id)),

  userData: state.user.data,
});

const mapDispatchToProps = dispatch => ({
  fetchUserRecipes: () => dispatch(fetchUserRecipes()),
  fetchUserFavorites: () => dispatch(fetchUserFavorites()),
  updateUserProfilePhoto: uploadedImageUrl =>
    dispatch(updateUserProfilePhoto(uploadedImageUrl)),
});

UserProfile.propTypes = {
  fetchUserFavorites: PropTypes.func.isRequired,
  fetchUserRecipes: PropTypes.func.isRequired,
  updateUserProfilePhoto: PropTypes.func.isRequired,
  userRecipes: PropTypes.arrayOf(PropTypes.object),
  userFavorites: PropTypes.arrayOf(PropTypes.object),
  userData: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

UserProfile.defaultProps = {
  userRecipes: null,
  userFavorites: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
