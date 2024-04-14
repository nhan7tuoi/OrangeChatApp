import {configureStore} from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import authSlice from './authSlice';
import conversationSlice from './conversationSlice';
import friendSlice from './friendSlice';
import {thunk} from 'redux-thunk';

const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authSlice,
    conversation: conversationSlice,
    friend: friendSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
});
export default store;
