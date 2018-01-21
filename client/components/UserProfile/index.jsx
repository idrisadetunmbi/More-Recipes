import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class UserProfile extends Component {
  state = {
    myRecipeTabIsActive: true,
    uploadingUserImage: false,
  }

  componentWillMount() {
    this.props.fetchUserRecipes();
  }

  componentDidMount() {
    $('ul.tabs').tabs();
  }

  componentWillReceiveProps(nextProps) {
    // if the user signs out on user's profile page
    if (Object.keys(nextProps.userData).length === 0) {
      this.props.history.replace('/catalog');
    }
  }

  onChangeImageInput = async (event) => {
    this.setState(() => ({ uploadingUserImage: true }));
    let response;
    try {
      response = await sendImageToCloudinary(event.target.files[0]);
    } catch (error) {
      console.log(error);
      showToast(`An error occured while uploading image - ${error.message}`);
      this.setState(() => ({ uploadingUserImage: false }));
      return;
    }
    const uploadedImageUrl = response.data.secure_url;
    this.props.updateUserProfilePhoto(uploadedImageUrl);
    this.setState(() => ({ uploadingUserImage: false }));
  }

  render() {
    const { userRecipes, userData, userFavorites } = this.props;
    return (
      <div className="container" id="user-profile-component">
        <div className="row">
          <div className="col l4 center" id="user-info">
            <div style={{ width: '87%' }}>
              <div id="user-image">
                <img
                  className="responsive-img"
                  src={userData.imageUrl || UserAvatar}
                  alt="userprofilepic"
                />
                {
                  this.state.uploadingUserImage ?
                    <div className="progress">
                      <div className="indeterminate" />
                    </div> :
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
              <h5 className="title">{`@${userData.username}`}</h5>
              <div style={{ marginBottom: '.5rem' }}>
                <span>
                  <img
                    title="Number of recipes"
                    src={Logo}
                    style={{ width: '1.3rem', verticalAlign: 'middle' }}
                    alt=""
                  />
                  <span style={{ marginLeft: '.3rem' }}>
                    {this.props.userRecipes && userRecipes.length}
                  </span>
                </span>
                <span style={{ marginLeft: '.3rem' }}>
                  <i
                    className="material-icons"
                    style={{ verticalAlign: 'middle' }}
                  >favorite
                  </i>
                  <span>{this.props.userFavorites && userFavorites.length}</span>
                </span>
              </div>
              <div className="divider" />
            </div>
          </div>

          <div className="col l8">
            <div className="row">
              <div className="col s12">
                <ul className="tabs">
                  <li className="tab col s3">
                    <a
                      href=""
                      onClick={() => this.setState({ myRecipeTabIsActive: true })}
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

            {
              this.state.myRecipeTabIsActive ?
                <RecipeList
                  recipes={this.props.userRecipes}
                  gridStyle="l4 m6 s12"
                  isLoadingRecipes={!this.props.userRecipes}
                />
                :
                <RecipeList
                  recipes={this.props.userFavorites}
                  gridStyle="l4 m6 s12"
                  isLoadingRecipes={!this.props.userFavorites}
                />
            }
          </div>
        </div>

        {
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
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
