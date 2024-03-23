import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import CaNhanScreen from '../screens/CaNhanScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='TabNavigator'>
            {/* <Stack.Screen name='LoginNavigator' component={LoginNavigator} /> */}
            <Stack.Screen name='TabNavigator' component={TabNavigator} />
            <Stack.Screen name='ChatScreen' component={ChatScreen} />
            <Stack.Screen name='CaNhanScreen' component={CaNhanScreen} />
        </Stack.Navigator>
    );
}
export default MainNavigation;
