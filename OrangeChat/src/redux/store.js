import {configureStore} from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import authSlice from './authSlice';
import conversationSlice from './conversationSlice';
import friendSlice from './friendSlice';

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authSlice,
    conversation: conversationSlice,
    friend: friendSlice,
  },
});
export default store;
