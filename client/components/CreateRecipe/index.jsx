import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import validator from 'validator';

import IconAddRecipe from './photo-video-slr-camera-icon.png';
import { recipeAction } from '../../actions/recipe';
import { showToast } from '../../utils';


class CreateRecipe extends React.Component {
  state = {
    title: '',
    description: '',
    ingredients: '',
    directions: '',
    imagesSelected: [],
    uploadedImageUrls: [],
    isUploadingImages: false,
    fieldErrors: {
      title: '',
      description: '',
      ingredients: '',
      directions: '',
      images: '',
    },
  }

  // eslint-disable-next-line
  onChange = (e) => {
    const inputFieldName = e.target.name;
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        images: '',
      },
    });
    // refers to first image upload, i.e. clicking the 'add images' input field
    if (inputFieldName === 'images upload') {
      const fileArray = Array.from(e.target.files);
      this.setState({ imagesSelected: fileArray });
      return;
    }
    if (inputFieldName === 'add more images') {
      const fileArray = Array.from(e.target.files);
      const selectedImagesNames = this.state.imagesSelected.map(image => image.name);
      const newImages = fileArray.filter(file => !selectedImagesNames.includes(file.name));
      this.setState({ imagesSelected: [...this.state.imagesSelected, ...newImages] });
    }
  }

  onFocus = (e) => {
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        [e.target.name]: '',
      },
    });
  }

  onBlur = (e) => {
    const inputFieldName = e.target.name;
    switch (inputFieldName) {
      case 'title': {
        const inputFieldValue = e.target.value.trim();
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
        const inputFieldValue = e.target.value.trim();
        if (
          !validator.isLength(inputFieldValue, { min: 5 })
        ) {
          this.setState({
            fieldErrors: {
              ...this.state.fieldErrors,
              [inputFieldName]: `invalid ${inputFieldName} - must be longer than 5 characters`,
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

  onSubmit = async (e) => {
    e.preventDefault();
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
    if (this.state.uploadedImageUrls.length === 0) {
      const imageUploadURLS = this.generateImageUploadURLS(this.state.imagesSelected);
      await this.sendImagesToCloudinary(imageUploadURLS);
    } else {
      // TODO: Check if new images have been added to this.state.imagesSelected
      // compare already uploaded images to new images
    }
    const {
      title, description, ingredients, directions, uploadedImageUrls,
    } = this.state;
    const recipeData = {
      title, description, ingredients, directions, images: uploadedImageUrls,
    };
    this.props.createRecipe(recipeData);
  }

  removeImage = (imageName) => {
    const otherImages = this.state.imagesSelected.filter(file => file.name !== imageName);
    this.setState({ imagesSelected: otherImages });
  }

  generateImageUploadURLS = (imageFiles) => {
    const imageUploadURLS = imageFiles.map((imageFile) => {
      const imageUploadData = new FormData();
      imageUploadData.append('file', imageFile);
      imageUploadData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
      return axios.post(process.env.CLOUDINARY_UPLOAD_URL, imageUploadData);
    });
    return imageUploadURLS;
  }

  sendImagesToCloudinary = (imageUploadURLS) => {
    this.setState({ isUploadingImages: true });
    return new Promise((resolve, reject) => {
      axios.all(imageUploadURLS).then(axios.spread((...responses) => {
        console.log('cloudinary response', responses);
        const uploadedImageUrls = responses.map(resp => resp.data.secure_url);
        this.setState({
          uploadedImageUrls,
          isUploadingImages: false,
        });
        resolve(uploadedImageUrls);
      })).catch((error) => {
        reject(error);
      });
    });
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    const { initiated, error } = nextProps.recipeAction;
    if (initiated) {
      return;
    }
    if (error) {
      showToast(`error creating recipe - ${error}`);
      return;
    }
    this.props.history.goBack();
  }

  render() {
    const {
      imagesSelected, fieldErrors,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit} style={{ paddingBottom: '3rem' }}>
        <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          <h5 style={{ fontFamily: 'Raleway' }}>Add a New Recipe</h5>
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="title">Title</label>
          <input required name="title" style={{ marginBottom: '0' }} type="text" onBlur={this.onBlur} onFocus={this.onFocus} />
          {fieldErrors.title.length > 0 && <span style={{ color: 'red' }}>{fieldErrors.title}</span>}
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label htmlFor="description">Description</label>
          <textarea
            className="materialize-textarea"
            // value={description}
            onFocus={this.onFocus}
            style={{ marginBottom: '0' }}
            required
            name="description"
            onBlur={this.onBlur}
          />
          {fieldErrors.description.length > 0 && <span style={{ color: 'red' }}>{fieldErrors.description}</span>}
        </div>
      
        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label className="active" htmlFor="ingredients">Ingredients</label>
          <textarea
            placeholder="Each ingredient should go on a new line"
            className="materialize-textarea"
            // value={ingredients}
            onFocus={this.onFocus}
            style={{ marginBottom: '0' }}
            required
            name="ingredients"
            onBlur={this.onBlur}
          />
          {fieldErrors.ingredients.length > 0 && <span style={{ color: 'red' }}>{fieldErrors.ingredients}</span>}
        </div>

        <div className="input-field" style={{ marginBottom: '20px' }}>
          <label className="active" htmlFor="directions">Directions</label>
          <textarea
            placeholder="new direction should go on a new line"
            className="materialize-textarea"
            // value={directions}
            onFocus={this.onFocus}
            style={{ marginBottom: '0' }}
            required
            name="directions"
            onBlur={this.onBlur}
          />
          {fieldErrors.directions.length > 0 && <span style={{ color: 'red' }}>{fieldErrors.directions}</span>}
        </div>

        {
          imagesSelected.length === 0 ?
          (
            <div style={{ border: '.5px dashed gray', marginBottom: '1rem' }} className="col s12 file-field input-field center">
              <img style={{ marginTop: '2rem', height: '2.5rem' }} alt="add recipe" src={IconAddRecipe} />
              <input type="file" accept=".jpg, .jpeg, .png" name="images upload" multiple onChange={this.onChange} />
              <p style={{ fontSize: '1.3rem', opacity: '0.7', textAlign: 'center', fontFamily: 'Raleway' }}>Add images</p>
              {fieldErrors.images.length > 0 && <span style={{ color: 'red' }}>{fieldErrors.images}</span>}
            </div>
          ) :
          (
            <div>
              <div style={{ position: 'relative', border: '.5px dashed gray', padding: '.5rem 0', textAlign: 'center' }} className="col s12">
                {
                  this.state.isUploadingImages && <UploadingOverlay />
                }
                {
                  imagesSelected.map((image, i) => {
                    const preview = window.URL.createObjectURL(image);
                    return (
                      <div key={`${image.name}`} style={{ width: '50%', display: 'inline-block', padding: '.5rem' }}>
                        <img src={preview} alt="" style={{ width: '100%' }} />
                        <span style={{ cursor: 'pointer', opacity: '0.5' }} onClick={() => this.removeImage(`${image.name}`)}>
                          <i className="material-icons">cancel</i>
                        </span>
                      </div>
                    );
                  })
                }
              </div>
              <div style={{ border: '.5px dashed gray', padding: '1rem', marginBottom: '1rem' }} className="col s12 file-field input-field center">
                <img style={{ height: '2.5rem' }} alt="add recipe" src={IconAddRecipe} />
                <input disabled={this.state.isUploadingImages} type="file" accept=".jpg, .jpeg, .png" name="add more images" multiple onChange={this.onChange} />
                <span style={{ fontSize: '1.3rem', opacity: '0.7', verticalAlign: 'super', marginLeft: '1rem', fontFamily: 'Raleway' }}>Add more</span>
              </div>
            </div>
          )
        }
        <div>
          <button disabled={this.state.isUploadingImages} className="btn-large waves-effect waves-light" style={{ textTransform: 'none', width: '100%', backgroundColor: '#444' }}>SUBMIT</button>
          {this.props.recipeAction.initiated && <div className="progress"><div className="indeterminate" /></div>}
        </div>
      </form>
    );
  }
}

const UploadingOverlay = () => (
  <div style={{
    background: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1002,
    opacity: 0.5,
    }}
  >
    <div
      style={{ position: 'absolute', top: '33%', left: '36%' }}
      className="preloader-wrapper active"
    >
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

const mapStateToProps = (state) => {
  return {
    recipeAction: state.recipes.recipeAction,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createRecipe: recipeData => dispatch(recipeAction('create', recipeData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipe);
