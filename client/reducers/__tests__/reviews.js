import reducer from '../reviews';
import * as actions from '../../actions/reviews';

const mocks = {
  state: { 2: {} },
  initialState: { error: null },
  error: {},
};

describe('Reviews reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(mocks.initialState);
  });

  it('should handle ERROR_REVIEWS', () => {
    expect(reducer(mocks.state, actions.errorReviews(mocks.error)))
      .toEqual({
        ...mocks.state,
        error: mocks.error,
      });
  });

  it('should handle RECEIVE_REVIEWS', () => {
    expect(reducer(mocks.state, actions.receiveReviews({}, 1)))
      .toEqual({
        ...mocks.state,
        1: {},
        error: null,
      });
  });

  it('should handle ADD_RECIPE_REVIEW', () => {
    expect(reducer(mocks.state, actions.addRecipeReview(2, {})))
      .toEqual({
        ...mocks.state,
        2: [{}],
      });
  });
});
