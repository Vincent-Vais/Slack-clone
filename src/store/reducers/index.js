import { combineReducers } from "redux";

import userReducer from "./user-reducer";
import channelReducer from "./channel-reducer";
import colorsReducer from "./colors-reducer";

const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
  colors: colorsReducer,
});

export default rootReducer;
