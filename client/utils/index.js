import axios from 'axios';

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

export const showToast = message => Materialize.toast(message, 2000);
