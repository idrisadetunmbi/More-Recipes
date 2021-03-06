import React, { Component } from 'react';
import validator from 'validator';
import deepEqual from 'deep-equal';
import PropTypes from 'prop-types';

import IconAddRecipe from './photo-video-slr-camera-icon.png';
import { generateImageUploadURLS, sendImagesToCloudinary } from '../../utils';
import { TextArea } from '../reusables';

/**
 *
 *
 * @class EditView
 * @extends {Component}
 */
class EditView extends Component {
  state = {
    isUploadingImages: false,
    newImages: [],
    existingImages: this.props.recipe.images,
    fieldErrors: {},
    inputFields: {},
  }

  /**
   *
   * @returns {void}
   * @memberOf EditView
   */
  componentWillMount() {
    const {
      title, description, directions, ingredients, images,
    } = this.props.recipe;
    const existingData = {
      title, description, directions, ingredients, images,
    };
    this.setState({ inputFields: existingData });
  }

  /**
   * @returns {void}
   * @memberOf EditView
   */
  componentDidMount() {
    const elems = document.getElementsByTagName('textarea');
    for (let i = 0; i < elems.length; i += 1) {
      elems[i].style.height = `${elems[i].scrollHeight - 37}px`;
    }
  }

  /**
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf EditView
   */
  onChange = (event) => {
    const inputFieldName = event.target.name;
    if (inputFieldName === 'add more images') {
      this.setState({
        fieldErrors: { ...this.state.fieldErrors, images: null },
      });
      const fileArray = Array.from(event.target.files);
      const selectedImagesNames = this.state.newImages.map(image => image.name);
      // remove duplicate images
      const newImages = fileArray
        .filter(file => !selectedImagesNames.includes(file.name));
      this.setState({ newImages: [...this.state.newImages, ...newImages] });
    }
  }

  /**
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf EditView
   */
  onBlur = (event) => {
    const inputFieldName = event.target.name;
    const inputFieldValue = event.target.value.trim().replace(/\n\n/g, '\n');
    if (!validator.isLength(inputFieldValue, { min: 5 })) {
      this.setState({
        fieldErrors: {
          ...this.state.fieldErrors,
          [inputFieldName]:
            `please include ${inputFieldName} with at least 5 characters`,
        },
      });
    }
    this.setState({
      inputFields: {
        ...this.state.inputFields,
        [inputFieldName]: inputFieldValue,
      },
    });
  }

  /**
   * @param {Object} event - DOM event
   *
   * @returns {void}
   * @memberOf EditView
   */
  onFocus = (event) => {
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        [event.target.name]: null,
      },
    });
  }

  /**
   *
   *
   * @returns {void}
   * @memberOf EditView
   */
  onSubmit = async () => {
    const {
      newImages, existingImages, fieldErrors, inputFields,
    } = this.state;
    const imagesCombined = [...newImages, ...existingImages];

    // if there are no data changes
    if (this.confirmNoDataChanges()) {
      this.props.toggleViewMode();
      return;
    }
    // if there is an error in any of the input fields
    if (
      !(Object.values(this.state.fieldErrors).every(val => !val))
    ) {
      return;
    }

    if (imagesCombined.length === 0) {
      this.setState({
        fieldErrors: {
          ...fieldErrors,
          images: 'please add at least one image',
        },
      });
      return;
    }
    let uploadedImageUrls;
    if (newImages.length > 0) {
      this.setState({ isUploadingImages: true });
      const imageUploadUrls = generateImageUploadURLS(newImages);
      try {
        uploadedImageUrls = await sendImagesToCloudinary(imageUploadUrls);
      } catch (error) {
        this.setState({ isUploadingImages: false });
        return;
      }
      this.setState({
        isUploadingImages: false,
      });
    }

    uploadedImageUrls = uploadedImageUrls || [];

    const updatedRecipeDetails = {
      id: this.props.recipe.id,
      ...inputFields,
      images: [...existingImages, ...uploadedImageUrls],
    };
    this.props.recipeAction('update', updatedRecipeDetails);
  }

  /**
   *
   *
   * @returns {void}
   * @memberOf EditView
   */
  confirmNoDataChanges = () => {
    const { newImages, existingImages, inputFields } = this.state;
    const imagesCombined = [...newImages, ...existingImages];

    const {
      title, description, directions, ingredients, images,
    } = this.props.recipe;
    const existingData = {
      title, description, directions, ingredients, images,
    };
    const newFormData = {
      ...inputFields,
      images: imagesCombined,
    };
    const noDataChanges = deepEqual(newFormData, existingData);
    return noDataChanges;
  }

  /**
   * @param {Object|String} image - name of image to remove or object
   * representing image
   *
   * @returns {void}
   * @memberOf EditView
   */
  removeImage = (image) => {
    if (this.state.isUploadingImages) return;

    // eslint-disable-next-line
    typeof image === 'string' ?
      this.setState({
        existingImages: this.state.existingImages.filter(img => image !== img),
      }) :
      this.setState({
        newImages: this.state.newImages.filter(img => img.name !== image.name),
      });
  }

  renderImageThumbnails = () => {
    const { existingImages, newImages } = this.state;
    return (
      <div style={{ padding: 0 }} className="row">
        {
          [...existingImages, ...newImages].map((image, index) =>
            (
              <div className="col center s6" id="thumbnails-row">
                <img
                  src={typeof image === 'string' ? image : window.URL.createObjectURL(image)}
                  alt={`thumbnail - ${index}`}
                />
                <i
                  className="material-icons"
                  style={{ cursor: 'pointer', opacity: '0.5' }}
                  onClick={() => this.removeImage(image)}
                >cancel
                </i>
              </div>
            ))
        }
      </div>
    );
  }

  renderAddMoreImages = () => (
    <div id="add-more-images" className="col s12 file-field input-field center">
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
      <span>{this.state.fieldErrors.images}</span>
    </div>
  )

  renderActionButtons = () => {
    const { recipe, user } = this.props;
    return user.id === recipe.authorId &&
      (
        <div>
          <div className="fixed-action-btn" style={{ marginBottom: '3em' }} >
            <a onClick={this.props.toggleViewMode} className="btn-floating btn-large">
              <i className="large material-icons yellow darken-1">cancel</i>
            </a>
          </div>
          <div className="fixed-action-btn" style={{ marginBottom: '7.5rem' }}>
            <a id="submit-btn" onClick={this.onSubmit} className="btn-floating btn-large">
              <i className="large material-icons">done</i>
            </a>
          </div>
        </div>
      );
  }

  /**
   *
   *
   * @returns {void}
   * @memberOf EditView
   */
  render() {
    const { recipe } = this.props;
    return (
      <div className="recipe-details-component">
        <div className="container-section container">
          <div className="row" id="recipe-info">
            <div className="col s12 l4 images-section">
              <TextArea
                defaultValue={this.state.inputFields.title}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                fieldError={this.state.fieldErrors.title}
                name="title"
              />
              {this.renderImageThumbnails()}
              {this.renderAddMoreImages()}
            </div>
            <div className="col s12 offset-l1 l6 description-section">
              <TextArea
                defaultValue={recipe.description}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                name="description"
                fieldError={this.state.fieldErrors.description}
              />
              <TextArea
                defaultValue={recipe.ingredients.replace(/\n/g, '\n\n')}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                name="ingredients"
                fieldError={this.state.fieldErrors.ingredients}
              />
              <TextArea
                defaultValue={recipe.directions.replace(/\n/g, '\n\n')}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                name="directions"
                fieldError={this.state.fieldErrors.directions}
              />
            </div>
          </div>
        </div>
        {this.renderActionButtons()}
      </div>
    );
  }
}

EditView.propTypes = {
  recipe: PropTypes.shape().isRequired,
  toggleViewMode: PropTypes.func.isRequired,
  recipeAction: PropTypes.func.isRequired,
  user: PropTypes.shape().isRequired,
};

export default EditView;
