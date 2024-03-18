import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import authSlice from './authSlice';
import isUserSlice from './isUserSlice';
import conversationSlice from './conversationSlice';

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authSlice,
    isUser: isUserSlice,
    conversation: conversationSlice,
  },
});
export default store;
