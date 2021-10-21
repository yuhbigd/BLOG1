import { combineReducers } from "redux";
import userReducer from "./userReducer";

export const ACTION_TYPES = {
  ADD_USER: "add_user",
  SHOW_MODAL: "show_modal",
  HIDE_MODAL: "hide_modal",
};

const reducers = combineReducers({
  user: userReducer,
});

export default reducers;
