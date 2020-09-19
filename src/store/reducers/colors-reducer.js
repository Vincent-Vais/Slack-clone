import * as actionTypes from "../actions/types";

const INITIAL_STATE = {
  primaryColor: "#4c3c4c",
  secondaryColor: "#eee",
};

const colorsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
      };
    default:
      return state;
  }
};

export default colorsReducer;
