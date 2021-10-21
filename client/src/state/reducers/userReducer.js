import { ACTION_TYPES } from ".";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_USER:
      return action.payload;
    default:
      return state;
  }
};
