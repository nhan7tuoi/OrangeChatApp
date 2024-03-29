import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18next from 'i18next';
import FriendApi from '../apis/FriendApi';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-paper';
import {
  addFriendRequsts,
  fetchFriendRequests,
  fetchFriends,
  setFriends,
  updateFriendRequests,
} from '../redux/friendSlice';
import {useFocusEffect} from '@react-navigation/native';
import connectSocket from '../server/ConnectSocket';

const FriendRequestScreen = ({navidation, route}) => {
  const user = useSelector(state => state.auth.user);
  const {width, height} = Dimensions.get('window');
  const dispatch = useDispatch();
  const listFriendRequests = useSelector(
    state => state.friend.listFriendRequests,
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          dispatch(fetchFriendRequests(user._id));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [user._id, dispatch]),
  );
  useEffect(() => {
    connectSocket.initSocket();
    connectSocket.on('newFriendRequest', data => {
      dispatch(addFriendRequsts(data));
    });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={listFriendRequests}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  width: width * 0.9,
                  height: height * 0.1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: Colors.darkOrange,
                  padding: 5,
                  borderRadius: 10,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                }}>
                <View
                  style={{
                    width: width * 0.15,
                  }}>
                  <Image
                    source={{uri: item.senderId.image}}
                    style={{width: 55, height: 55}}
                  />
                </View>
                <View
                  style={{
                    width: width * 0.5,
                  }}>
                  <Text style={{fontSize: 16, fontWeight: '700'}}>
                    {item.senderId.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: width * 0.2,
                  }}>
                  <Pressable
                    onPress={() => {
                      FriendApi.accept({friendRequestId: item._id});
                      dispatch(updateFriendRequests(item._id));
                    }}>
                    {/* <Icon
                    //change icon accept
                      source={require('../assets/icon/chat.png')}
                      size={28}
                      color={Colors.darkOrange}
                    /> */}
                    <Text>A</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      FriendApi.reject({friendRequestId: item._id});
                      dispatch(updateFriendRequests(item._id));
                    }}>
                    {/* <Icon
                    // change icon  reject
                      source={require('../assets/icon/bin.png')}
                      size={28}
                      color={Colors.darkOrange}
                    /> */}
                    <Text>X</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendRequestScreen;

const styles = StyleSheet.create({});
