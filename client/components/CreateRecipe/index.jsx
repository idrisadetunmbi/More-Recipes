import React, { Component } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';

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
class CreateRecipe extends Component {
  state = {
    title: '',
    description: '',
    ingredients: '',
    directions: '',
    imagesSelected: [],
    uploadedImagesUrls: [],
    isUploadingImages: false,
    fieldErrors: {
      title: '',
      description: '',
      ingredients: '',
      directions: '',
      images: '',
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
              title: '',
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
              [inputFieldName]: '',
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
        images: '',
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

    // if any of the input field errors has not been corrected
    if (
      !(Object.values(this.state.fieldErrors).every(val => val.length === 0))
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
        return;
      }
      this.setState({
        uploadedImagesUrls,
        isUploadingImages: false,
      });
    } else {
      // TODO: Check if new images have been added to this.state.imagesSelected
      // compare already uploaded images to new images
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

  /**
   * @returns {Object} create recipe form element
   * @memberOf CreateRecipe
   */
  render() {
    const {
      imagesSelected, fieldErrors,
    } = this.state;

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
          {fieldErrors.title.length > 0 && <span>{fieldErrors.title}</span>}
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="description">Description</label>
          <textarea
            className="materialize-textarea"
            onFocus={this.onFocus}
            required
            name="description"
            onBlur={this.onBlur}
          />
          {fieldErrors.description.length > 0
            && <span>{fieldErrors.description}</span>}
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
          {fieldErrors.ingredients.length > 0 &&
            <span>{fieldErrors.ingredients}</span>}
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
          {fieldErrors.directions.length > 0 &&
            <span>{fieldErrors.directions}</span>}
        </div>

        {
          imagesSelected.length === 0 ?
          (
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
              {fieldErrors.images.length > 0 &&
                <span>{fieldErrors.images}</span>}
            </div>
          ) :
          (
            <div>
              <div id="image-preview-section" className="col s12">
                {
                  this.state.isUploadingImages && <UploadingOverlay />
                }
                {
                  imagesSelected.map((image, i) => {
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
            </div>
          )
        }
        <div>
          <button
            disabled={this.state.isUploadingImages}
            className="btn-large waves-effect waves-light"
          >SUBMIT
          </button>
          {this.props.recipeActionInitiated &&
            <div className="progress"><div className="indeterminate" /></div>}
        </div>
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

const mapStateToProps = state => ({
  recipeActionInitiated: state.recipes.requestInitiated,
  recipeActionErrored: state.recipes.requestError,
});

const mapDispatchToProps = dispatch => ({
  createRecipe: recipeData => dispatch(recipeAction('create', recipeData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipe);
