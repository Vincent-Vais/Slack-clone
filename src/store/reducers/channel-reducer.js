import * as actionTypes from "../actions/types";

const INITIAL_STATE = {
  currentChannel: null,
  isPrivate: false,
  userPosts: null,
};

const channelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
        isPrivate: false,
      };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivate: action.payload,
      };
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };
    default:
      return state;
  }
};

export default channelReducer;
