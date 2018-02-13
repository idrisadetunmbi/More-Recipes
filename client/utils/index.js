import axios from 'axios';
import jwt from 'jsonwebtoken';

export const generateImageUploadURLS = (imageFiles) => {
  const imageUploadURLS = imageFiles.map((imageFile) => {
    const imageUploadData = new FormData();
    imageUploadData.append('file', imageFile);
    imageUploadData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
    return axios.post(process.env.CLOUDINARY_UPLOAD_URL, imageUploadData);
  });
  return imageUploadURLS;
};

export const sendImagesToCloudinary = imageUploadURLS =>
  new Promise((resolve, reject) => {
    axios.all(imageUploadURLS).then(axios.spread((...responses) => {
      const uploadedImageUrls = responses.map(resp => resp.data.secure_url);
      resolve(uploadedImageUrls);
    })).catch((error) => {
      reject(error);
    });
  });

export const sendImageToCloudinary = (imageFile) => {
  const imageUploadData = new FormData();
  imageUploadData.append('file', imageFile);
  imageUploadData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
  return axios.post(process.env.CLOUDINARY_UPLOAD_URL, imageUploadData);
};

// UI util
export const showToast = message => Materialize.toast(message, 2000);

// redux store utils
/**
 *
 * loads user data from the local storage
 * @returns {Object} - an object representing the user's data from local
 * storage or null
 */
export const hydrateUserData = () => {
  const usersStoredData = JSON.parse(localStorage.getItem('user'));
  // user's token must still be valid before user data can be hydrated
  // into the app
  if (usersStoredData) {
    try {
      jwt.verify(usersStoredData.data.token, process.env.JWT_AUTH_SECRET);
    } catch (error) {
      return null;
    }
  }
  return usersStoredData;
};
