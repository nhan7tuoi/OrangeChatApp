import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNavigator from './LoginNavigator';
import TestFireBase from '../screens/TestFireBase';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='LoginNavigation'>
                <Stack.Screen name='LoginNavigaviton' component={LoginNavigator} />
                <Stack.Screen name='TestFireBase' component={TestFireBase} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default MainNavigation;
