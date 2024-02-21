import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaNhanScreen from '../screens/CaNhanScreen';
import NhomScreen from '../screens/NhomScreen';
import DanhBaScreen from '../screens/DanhBaScreen';
import TaiKhoanScreen from '../screens/TaiKhoanScreen';
import { useSelector } from 'react-redux';
import i18next from '../i18n/i18n';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
    i18next.changeLanguage(selectedLanguage);
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'rgba(238, 102, 25, 1)',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
                backgroundColor: 'black',
                borderTopWidth: 2,
                borderTopColor: 'rgba(238, 102, 25, 1)',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                shadowOpacity: 4,
                shadowRadius: 4,
                elevation: 4,
                shadowOffset: {
                    width: 0,
                    height: -4
                },
                height: 60,
            }
        }}>
            <Tab.Screen name="CaNhan" component={CaNhanScreen}
                options={{
                    tabBarLabel: i18next.t('caNhan'),
                    tabBarLabelStyle:{fontSize:12},
                    tabBarIcon: ({ focused }) => {
                        return (
                            focused ? (
                                <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/VectorcaNhan.png')} />
                            ) : (
                                <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/VectorcaNhan2.png')} />
                            )
                        )
                    }
                }}
            />
            <Tab.Screen name="Nhom" component={NhomScreen} options={{
                tabBarLabel: i18next.t('nhom'),
                tabBarLabelStyle:{fontSize:12},
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? (
                            <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/Vectornhom.png')} />
                        ) : (
                            <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/Vectornhom2.png')} />
                        )
                    )
                }
            }} />
            <Tab.Screen name="DanhBa" component={DanhBaScreen} options={{
                tabBarLabel: i18next.t('danhBa'),
                tabBarLabelStyle:{fontSize:12},
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? (
                            <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/VectordanhBa.png')} />
                        ) : (
                            <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/VectordanhBa2.png')} />
                        )
                    )
                }
            }} />
            <Tab.Screen name="TaiKhoan" component={TaiKhoanScreen} options={{
                tabBarLabel: i18next.t('user'),
                tabBarLabelStyle:{fontSize:12},
                tabBarIcon: ({ focused }) => {
                    return (
                        focused ? (
                            <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/VectortaiKhoan.png')} />
                        ) : (
                            <Image style={{ width: 24, height: 24 }} source={require('../assets/icon/VectortaiKhoan2.png')} />
                        )
                    )
                }
            }} />
        </Tab.Navigator>
    );
}

export default TabNavigator;
