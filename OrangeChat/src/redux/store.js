import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices';

const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});
export default store;
