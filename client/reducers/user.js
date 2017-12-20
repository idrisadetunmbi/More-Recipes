import * as UserAuthActions from '../actions/user';

const user = (state = {
  authRequestInitiated: false,
  authError: null,
  data: {},
}, action) => {
  switch (action.type) {
    case UserAuthActions.INITIATE_AUTH_REQUEST:
      return {
        authError: null,
        data: {},
        authRequestInitiated: true,
      };
    case UserAuthActions.RECEIVE_AUTH_RESPONSE:
      return {
        authRequestInitiated: false,
        authError: null,
        data: action.response,
      };
    case UserAuthActions.ERROR_AUTH_REQUEST:
      return {
        authRequestInitiated: false,
        authError: action.error,
        data: {},
      };
    case UserAuthActions.REMOVE_USER_TOKEN:
      return {
        ...state,
        data: {
          ...state.data,
          token: null,
        },
      };
    default:
      return state;
  }
};

export default user;

