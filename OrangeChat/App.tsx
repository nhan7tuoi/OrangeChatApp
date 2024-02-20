/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstScreen from './src/screens/FirstScreen';
import { Provider } from 'react-redux';
import store from './src/redux/store';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <Temp />
    </Provider>
  )
}
const Temp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='FirstScreen'
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;
