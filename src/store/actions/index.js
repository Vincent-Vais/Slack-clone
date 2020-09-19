import * as actionTypes from "./types";

// USERS
export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: user,
});
export const clearUser = () => ({
  type: actionTypes.CLEAR_USER,
});

// CHANNELS
export const setCurrentChannel = (channel) => ({
  type: actionTypes.SET_CURRENT_CHANNEL,
  payload: channel,
});
export const setPrivateChannel = (isPrivate) => ({
  type: actionTypes.SET_PRIVATE_CHANNEL,
  payload: isPrivate,
});
export const setUserPosts = (posts) => ({
  type: actionTypes.SET_USER_POSTS,
  payload: posts,
});

// COLORS
export const setColors = (primaryColor, secondaryColor) => ({
  type: actionTypes.SET_COLORS,
  payload: {
    primaryColor,
    secondaryColor,
  },
});
