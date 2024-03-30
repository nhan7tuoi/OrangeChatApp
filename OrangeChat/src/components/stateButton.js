import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchFriendRequests,
  fetchFriends,
  updateFriendRequests,
} from '../redux/friendSlice';
import FriendApi from '../apis/FriendApi';
import {Icon} from 'react-native-paper';
import Colors from '../themes/Colors';
import connectSocket from '../server/ConnectSocket';

const StateButton = props => {
  const {width, height} = Dimensions.get('window');
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    connectSocket.initSocket();
  }, []);

  const sendFriendRequest = receiverId => {
    console.log(receiverId);
    const requestData = {
      senderId: user._id,
      receiverId: receiverId,
    };
    connectSocket.emit('send friend request', requestData);
  };
  if (!props.listFriends.find(f => f._id === props.itemId)) {
    if (props.listFriendRequests.find(fq => fq.senderId === props.itemId)) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.2,
          }}>
          <Pressable
            onPress={() => {
              FriendApi.accept({friendRequestId: fq._id});
              dispatch(updateFriendRequests(fq._id));
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
              FriendApi.reject({friendRequestId: fq._id});
              dispatch(updateFriendRequests(fq._id));
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
      );
    }
    if (
      props.listFriendRequests.find(
        fq => fq.senderId === user._id && fq.receiverId === props.itemId,
      )
    ) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width * 0.1,
          }}>
          <Pressable>
            <Icon
              source={require('../assets/icon/add-friend.png')}
              size={28}
              color={Colors.darkOrange}
            />
          </Pressable>
        </View>
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width * 0.1,
        }}>
        <Pressable
          onPress={() => {
            sendFriendRequest(props.itemId);
            props.onPressButton();
          }}>
          <Icon
            source={require('../assets/icon/add-user.png')}
            size={28}
            color={Colors.darkOrange}
          />
        </Pressable>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width * 0.2,
        }}>
        <Pressable>
          <Icon
            source={require('../assets/icon/chat.png')}
            size={28}
            color={Colors.darkOrange}
          />
        </Pressable>
        <Pressable>
          <Icon
            source={require('../assets/icon/bin.png')}
            size={28}
            color={Colors.darkOrange}
          />
        </Pressable>
      </View>
    );
  }
};

export default StateButton;

const styles = StyleSheet.create({});
