/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { Provider } from 'react-redux';
import store from './src/redux/store';

import MainNavigation from './src/navigations/MainNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <MainNavigation/>
    </Provider>
  )
}

export default App;
