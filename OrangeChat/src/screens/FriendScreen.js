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
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18next from 'i18next';
import FriendApi from '../apis/FriendApi';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'react-native-paper';
import {
  fetchFriendRequests,
  fetchFriends,
  setFriendRequests,
  setFriends,
} from '../redux/friendSlice';
import {useFocusEffect} from '@react-navigation/native';

const FriendScreen = ({navigation, route}) => {
  const user = useSelector(state => state.auth.user);
  const {width, height} = Dimensions.get('window');
  const dispatch = useDispatch();
  const listFriends = useSelector(state => state.friend.listFriends);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          dispatch(fetchFriends(user._id));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [user._id, dispatch]),
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch(fetchFriends(user._id));
  //       dispatch(fetchFriendRequests(user._id));
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [navigation,dispatch]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <Pressable
        onPress={() =>
          navigation.navigate('SearchUser')
        }
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <TextInput
          style={{
            width: '80%',
            height: 50,
            backgroundColor: Colors.grey,
            borderRadius: 10,
            fontSize: 18,
            paddingLeft: 40,
            color: Colors.white,
          }}
          placeholder={i18next.t('timKiem')}
          placeholderTextColor={Colors.white}
          cursorColor={Colors.white}
          readOnly
        />
        <Image
          style={{position: 'absolute', left: 50, width: 24, height: 24}}
          source={require('../assets/icon/Vectorsearch.png')}
        />
      </Pressable>
      <View
        style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={listFriends}
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
                    source={{uri: item.image}}
                    style={{width: 55, height: 55}}
                  />
                </View>
                <View
                  style={{
                    width: width * 0.5,
                  }}>
                  <Text style={{fontSize: 16, fontWeight: '700'}}>
                    {item.name}
                  </Text>
                </View>
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
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({});
