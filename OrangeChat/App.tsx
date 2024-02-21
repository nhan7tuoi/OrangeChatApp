/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { Provider } from 'react-redux';
import store from './src/redux/store';

import LoginNavigation from './src/navigations/LoginNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <LoginNavigation/>
    </Provider>
  )
}

export default App;
