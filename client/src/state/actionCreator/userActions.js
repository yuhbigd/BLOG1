import { ACTION_TYPES } from "../reducers";

export const addUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_TYPES.ADD_USER,
      payload: user,
    });
  };
};
