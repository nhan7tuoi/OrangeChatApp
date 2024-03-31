import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import CaNhanScreen from '../screens/CaNhanScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchUserScreen from '../screens/SearchUserScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePassScreen from '../screens/ChangePassScreen';
import LanguageScreen from '../screens/LanguageScreen';
import i18next from '../i18n/i18n';
import Colors from '../themes/Colors';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='TabNavigator'>
            {/* <Stack.Screen name='LoginNavigator' component={LoginNavigator} /> */}
            <Stack.Screen name='TabNavigator' component={TabNavigator} />
            <Stack.Screen name='ChatScreen' component={ChatScreen} />
            <Stack.Screen name='CaNhanScreen' component={CaNhanScreen} />
            <Stack.Screen name='SearchUser' component={SearchUserScreen} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen}
                options={{
                    headerShown: true,
                    title: i18next.t('chinhSuaProfile'),
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen name='ChangePass' component={ChangePassScreen}
                options={{
                    headerShown: true,
                    title: i18next.t('doiMatKhau'),
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: 'white',
                }}
            />
            <Stack.Screen name='Language' component={LanguageScreen}
                options={{
                    headerShown: true,
                    title: i18next.t('ngonNgu'),
                    headerStyle: { backgroundColor: Colors.primary },
                    headerTintColor: 'white',
                }}
            />
        </Stack.Navigator>
    );
}
export default MainNavigation;
