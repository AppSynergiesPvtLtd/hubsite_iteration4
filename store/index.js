import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import adminbtnReducer from "./adminbtnSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    adminbtn:adminbtnReducer // Register user slice
  },
});

export default store;
