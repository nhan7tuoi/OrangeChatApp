import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import CaNhanScreen from '../screens/CaNhanScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchUserScreen from '../screens/SearchUserScreen';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='TabNavigator'>
            {/* <Stack.Screen name='LoginNavigator' component={LoginNavigator} /> */}
            <Stack.Screen name='TabNavigator' component={TabNavigator} />
            <Stack.Screen name='ChatScreen' component={ChatScreen} />
            <Stack.Screen name='CaNhanScreen' component={CaNhanScreen} />
            <Stack.Screen name='SearchUser' component={SearchUserScreen}/>
        </Stack.Navigator>
    );
}
export default MainNavigation;
