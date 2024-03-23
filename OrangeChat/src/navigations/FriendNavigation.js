import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs"
import FriendScreen from '../screens/FriendScreen';
import FriendRequestScreen from '../screens/FriendRequestScreen';
import i18next from 'i18next';
import Colors from '../themes/Colors';

const Tab = createMaterialTopTabNavigator();
const FriendNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Friend"
      screenOptions={{
        tabBarInactiveTintColor: 'white',
        tabBarActiveTintColor: 'rgba(238, 102, 25, 1)',
        tabBarStyle: {
          backgroundColor: Colors.black,
          borderBottomColor: 'rgba(238, 102, 25, 1)',
        },
        tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
        tabBarIndicatorStyle: {
          backgroundColor: 'rgba(238, 102, 25, 1)',
        },
      }}>
      <Tab.Screen
        name="Friend"
        component={FriendScreen}
        options={{tabBarLabel: i18next.t('banBe')}}
      />
      <Tab.Screen
        name="FriendRequest"
        component={FriendRequestScreen}
        options={{tabBarLabel: i18next.t('yeuCauKetBan')}}
      />
    </Tab.Navigator>
  );
}

export default FriendNavigation

const styles = StyleSheet.create({})