
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import FirstScreen from '../screens/FirstScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from '../navigations/TabNavigator';
import ChatScreen from '../screens/ChatScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ConfirmRegister from '../screens/ConfirmRegister';
import EnterInfoScreen from '../screens/EnterInfoScreen';

import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';

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
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen}
        options={{
          headerShown: true,
          title: i18next.t('dangKy'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name="EnterInfoScreen" component={EnterInfoScreen} options={{
        headerShown: true,
        title: i18next.t('nhapThongTin'),
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: 'white',
      }} />
      <Stack.Screen name="ConfirmRegister" component={ConfirmRegister}
        options={{
          headerShown: true,
          title: i18next.t('xacNhanDangKy'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
        }}
      />
      <Stack.Screen name='Tab' component={TabNavigator} />
      <Stack.Screen name='ChatScreen' component={ChatScreen} />
    </Stack.Navigator>
  )
}
export default LoginNavigator;
