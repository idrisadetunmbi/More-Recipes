import React, { Component } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import PropTypes from 'prop-types';

import IconAddRecipe from './photo-video-slr-camera-icon.png';
import { recipeAction } from '../../actions/recipes';
import {
  showToast, generateImageUploadURLS, sendImagesToCloudinary,
} from '../../utils';
import './index.scss';


/**
 *
 *
 * @class CreateRecipe
 * @extends {Component}
 */
export class CreateRecipe extends Component {
  state = {
    title: '',
    description: '',
    ingredients: '',
    directions: '',
    imagesSelected: [],
    uploadedImagesUrls: [],
    isUploadingImages: false,
    fieldErrors: {
      title: null,
      description: null,
      ingredients: null,
      directions: null,
      images: null,
    },
  }

  /**
   * @param {any} nextProps
   *
   * @returns {void}
   * @memberOf CreateRecipe
   */
  componentWillReceiveProps(nextProps) {
    const { recipeActionInitiated, recipeActionErrored } = nextProps;
    if (recipeActionInitiated) {
      return;
    }
    if (recipeActionErrored) {
      showToast(`error creating recipe - ${recipeActionErrored.message}`);
      return;
    }
    this.props.history.goBack();
  }

  /**
   * onFocus event handler for text input elements - used for validations
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf CreateRecipe
   */
  onFocus = (event) => {
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        [event.target.name]: '',
      },
    });
  }

  /**
   * onBlur event handler for text input elements - used for validations
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf CreateRecipe
   */
  onBlur = (event) => {
    const inputFieldName = event.target.name;
    switch (inputFieldName) {
      case 'title': {
        const inputFieldValue = event.target.value.trim();
        if (
          !validator.isLength(inputFieldValue, { min: 5, max: 50 }) ||
          validator.isInt(inputFieldValue)
        ) {
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              title: 'please include a title with at least 5 characters',
            },
          });
        } else {
          this.setState({
            title: inputFieldValue,
            fieldErrors: {
              ...this.state.fieldErrors,
              title: null,
            },
          });
        }
        break;
      }
      default: {
        const inputFieldValue = event.target.value.trim();
        if (
          !validator.isLength(inputFieldValue, { min: 5 })
        ) {
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              [inputFieldName]: `please include a ${inputFieldName}`,
            },
          });
        } else {
          this.setState({
            [inputFieldName]: inputFieldValue,
            fieldErrors: {
              ...this.state.fieldErrors,
              [inputFieldName]: null,
            },
          });
        }
        break;
      }
    }
  }

  /**
   * onchange event handler for image input element
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf CreateRecipe
   */
  onChange = (event) => {
    const inputFieldName = event.target.name;
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        images: null,
      },
    });
    // refers to first image upload, i.e. clicking the 'add images' input field
    if (inputFieldName === 'images upload') {
      const fileArray = Array.from(event.target.files);
      this.setState({ imagesSelected: fileArray });
      return;
    }
    if (inputFieldName === 'add more images') {
      const fileArray = Array.from(event.target.files);
      const selectedImagesNames = this.state.imagesSelected
        .map(image => image.name);
      const newImages = fileArray.filter(file => !selectedImagesNames
        .includes(file.name));
      this.setState({
        imagesSelected: [...this.state.imagesSelected, ...newImages],
      });
    }
  }

  /**
   * form element onSubmit event handler
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf CreateRecipe
   */
  onSubmit = async (event) => {
    event.preventDefault();
    if (this.state.imagesSelected.length < 1) {
      this.setState({
        fieldErrors: {
          ...this.state.fieldErrors,
          images: 'please add one image at least',
        },
      });
      return;
    }

    // if any of the input field errors has not been corrected i.e. is not equal
    // to null
    if (
      !(Object.values(this.state.fieldErrors).every(val => !val))
    ) {
      return;
    }

    // upload images if only they had not been previously uploaded
    // this can only occur if there was error from the server the
    // first time the user tried to create the recipe
    if (this.state.uploadedImagesUrls.length === 0) {
      this.setState({ isUploadingImages: true });
      const imgsUploadUrls = generateImageUploadURLS(this.state.imagesSelected);
      let uploadedImagesUrls;
      try {
        uploadedImagesUrls = await sendImagesToCloudinary(imgsUploadUrls);
      } catch (error) {
        showToast('There was an error performing this request');
        this.setState({ isUploadingImages: false });
        return;
      }
      this.setState({
        uploadedImagesUrls,
        isUploadingImages: false,
      });
    }

    const {
      title, description, ingredients, directions, uploadedImagesUrls,
    } = this.state;
    const recipeData = {
      title, description, ingredients, directions, images: uploadedImagesUrls,
    };
    this.props.createRecipe(recipeData);
  }

  /**
   * remove one image from the user selected images
   * @param {Object} imageName - name of image to remove
   *
   * @returns {void}
   * @memberOf CreateRecipe
   */
  removeImage = (imageName) => {
    const otherImages = this.state.imagesSelected
      .filter(file => file.name !== imageName);
    this.setState({ imagesSelected: otherImages });
  }

  renderImageSection = () => {
    const imageButton = () => (
      <div
        id="add-image-section"
        className="col s12 file-field input-field center"
      >
        <img alt="add recipe" src={IconAddRecipe} />
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          name="images upload"
          multiple
          onChange={this.onChange}
        />
        <p>Add images</p>
        {<span>{this.state.fieldErrors.images}</span>}
      </div>
    );

    const imagePreviewSection = () => (
      <div id="image-preview-section" className="col s12">
        {
          this.state.isUploadingImages && <UploadingOverlay />
        }
        {
          this.state.imagesSelected.map((image, i) => {
            const preview = window.URL.createObjectURL(image);
            return (
              <div id="image-preview" key={`${image.name}`}>
                <img src={preview} alt="" />
                <span onClick={() => this.removeImage(`${image.name}`)}>
                  <i className="material-icons">cancel</i>
                </span>
              </div>
            );
          })
        }
      </div>
    );

    const addMoreImagesBtn = () => (
      <div
        id="add-more-images"
        className="col s12 file-field input-field center"
      >
        <img alt="add recipe" src={IconAddRecipe} />
        <input
          disabled={this.state.isUploadingImages}
          type="file"
          accept=".jpg, .jpeg, .png"
          name="add more images"
          multiple
          onChange={this.onChange}
        />
        <span>Add more</span>
      </div>
    );

    return this.state.imagesSelected.length === 0 ?
      imageButton() :
      (
        <div>
          {imagePreviewSection()}
          {addMoreImagesBtn()}
        </div>
      );
  }

  renderSubmitButton = () => (
    <div>
      <button
        type="submit"
        id="submit-recipe"
        disabled={this.state.isUploadingImages}
        className="btn-large waves-effect waves-light"
      >SUBMIT
      </button>
      {this.props.recipeActionInitiated &&
        <div className="progress"><div className="indeterminate" /></div>}
    </div>
  )

  /**
   * @returns {Object} create recipe form element
   * @memberOf CreateRecipe
   */
  render() {
    const { fieldErrors } = this.state;

    return (
      <form onSubmit={this.onSubmit} id="create-recipe-component">
        <div id="title">
          <h5>Add a New Recipe</h5>
        </div>

        <div className="input-field">
          <label htmlFor="title">Title</label>
          <input
            required
            name="title"
            type="text"
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
          {<span>{fieldErrors.title}</span>}
        </div>

        <div className="input-field">
          <label htmlFor="description">Description</label>
          <textarea
            className="materialize-textarea"
            onFocus={this.onFocus}
            required
            name="description"
            onBlur={this.onBlur}
          />
          {<span>{fieldErrors.description}</span>}
        </div>

        <div className="input-field">
          <label className="active" htmlFor="ingredients">Ingredients</label>
          <textarea
            placeholder="Each ingredient should go on a new line"
            className="materialize-textarea"
            onFocus={this.onFocus}
            required
            name="ingredients"
            onBlur={this.onBlur}
          />
          {<span>{fieldErrors.ingredients}</span>}
        </div>

        <div className="input-field">
          <label className="active" htmlFor="directions">Directions</label>
          <textarea
            placeholder="new direction should go on a new line"
            className="materialize-textarea"
            onFocus={this.onFocus}
            required
            name="directions"
            onBlur={this.onBlur}
          />
          {<span>{fieldErrors.directions}</span>}
        </div>
        {this.renderImageSection()}
        {this.renderSubmitButton()}
      </form>
    );
  }
}

const UploadingOverlay = () => (
  <div id="uploading-overlay">
    <div className="preloader-wrapper active">
      <div className="spinner-layer spinner-green-only">
        <div className="circle-clipper left">
          <div className="circle" />
        </div>
        <div className="gap-patch">
          <div className="circle" />
        </div>
        <div className="circle-clipper right">
          <div className="circle" />
        </div>
      </div>
    </div>
  </div>
);

export const mapStateToProps = state => ({
  recipeActionInitiated: state.recipes.requestInitiated,
  recipeActionErrored: state.recipes.requestError,
});

export const mapDispatchToProps = dispatch => ({
  createRecipe: recipeData => dispatch(recipeAction('create', recipeData)),
});

CreateRecipe.propTypes = {
  recipeActionInitiated: PropTypes.bool.isRequired,
  recipeActionErrored: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  createRecipe: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipe);
