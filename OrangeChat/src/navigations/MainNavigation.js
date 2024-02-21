import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNavigator from './LoginNavigator';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='LoginNavigaviton' component={LoginNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default MainNavigation;
