import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import authSlice from './authSlice';

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authSlice,
  },
});
export default store;
