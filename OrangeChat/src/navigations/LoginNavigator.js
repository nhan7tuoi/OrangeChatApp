
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import FirstScreen from '../screens/FirstScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from '../navigations/TabNavigator';
import ChatScreen from '../screens/ChatScreen';

import i18next from '../i18n/i18n';

const Stack = createNativeStackNavigator();


const LoginNavigator = () => {
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  i18next.changeLanguage(selectedLanguage);
  return (
    <Stack.Navigator
      initialRouteName='FirstScreen'
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="FirstScreen" component={FirstScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{
          headerShown: true,
          title: i18next.t('dangNhap'),
          headerStyle: { backgroundColor: 'rgba(238, 102, 25, 1)' },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name='Tab' component={TabNavigator} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
    </Stack.Navigator>
  )
}
export default LoginNavigator;
