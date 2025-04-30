// import { legacy_createStore as createStore } from 'redux'

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
// export default store



import { configureStore, combineReducers } from "@reduxjs/toolkit";
import vehicleReducer from "./slices/vehicleSlice";

// Legacy reducer
const initialState = {
  sidebarShow: true,
  theme: "light",
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  ui: changeState, // Rename to avoid conflicts
  vehicle: vehicleReducer, //Vehicle fetch all
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
});

export default store;


