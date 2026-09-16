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



import { configureStore, combineReducers, createStore } from "@reduxjs/toolkit";
import vehicleReducer from "./slices/vehicleSlice";

// Legacy reducer
const initialState = {
  sidebarShow: false,
  activeSection: 'Dashboard',
  sidebarUnfoldable: false,
  theme: "light",
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set": {
      let hasChanged = false;
      for (const key of Object.keys(rest)) {
        if (state[key] !== rest[key]) {
          hasChanged = true;
          break;
        }
      }
      return hasChanged ? { ...state, ...rest } : state;
    }
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
// const store = configureStore({
//   reducer: rootReducer,
// });

const store = createStore(changeState)


export default store;


