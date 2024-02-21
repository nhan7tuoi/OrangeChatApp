
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import FirstScreen from '../screens/FirstScreen';
import LoginScreen from '../screens/LoginScreen';

import i18next from '../i18n/i18n';

const Stack = createNativeStackNavigator();


const LoginNavigation = () => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
    i18next.changeLanguage(selectedLanguage);
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default LoginNavigation;
