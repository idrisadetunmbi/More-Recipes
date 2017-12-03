import axios from 'axios';

export const INITIATE_AUTH_REQUEST = 'INITIATE_USER_AUTH_REQUEST';
export const initiateAuthRequest = () => {
  return {
    type: INITIATE_AUTH_REQUEST,
  };
};

export const RECEIVE_AUTH_RESPONSE = 'RECEIVE_AUTH_RESPONSE';
export const receiveAuthResponse = (response) => {
  return {
    type: RECEIVE_AUTH_RESPONSE,
    response,
  };
};

export const ERROR_AUTH_REQUEST = 'ERROR_AUTH_REQUEST';
export const errorAuthRequest = (error) => {
  return {
    type: ERROR_AUTH_REQUEST,
    error,
  };
};

export const userAuthRequest = (userData, authType) => (dispatch) => {
  dispatch(initiateAuthRequest());
  return axios.post(`/api/v1/users/${authType}`, userData)
    .then(
      response => dispatch(receiveAuthResponse(response.data.data)),
      (error) => {
        console.log(error.response);
        dispatch(errorAuthRequest(error.response.data));
      },
    );
};
