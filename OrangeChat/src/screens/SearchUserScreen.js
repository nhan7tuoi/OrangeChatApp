import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Dimensions,
  Pressable,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import i18next from 'i18next';
import Colors from '../themes/Colors';
import {Icon} from 'react-native-paper';
import authApi from '../apis/authApi';
import {useSelector} from 'react-redux';
import FriendApi from '../apis/FriendApi';

const SearchUserScreen = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const listFriend = route.params?.listFriend;
  const user = useSelector(state => state.auth.user);
  useEffect(() => {
    console.log(listFriend);
    const fetchData = async () => {
      try {
        if (keyword != '') {
          const res = await authApi.searchUsers({
            keyword: keyword,
            userId: user._id,
          });
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchData();
  }, [keyword]);

  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{
          height: height * 0.15,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          paddingTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.navigate('DanhBa')}>
            <Icon
              source={require('../assets/icon/VectoriconBack.png')}
              size={28}
              color={Colors.darkOrange}
            />
          </Pressable>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            {i18next.t('timKiem')}
          </Text>
          <View></View>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
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
            placeholder={i18next.t('nhapSoDienThoaiHoacTen')}
            placeholderTextColor={Colors.white}
            cursorColor={Colors.white}
            onChangeText={setKeyword}
          />
          <Image
            style={{position: 'absolute', left: 50, width: 24, height: 24}}
            source={require('../assets/icon/Vectorsearch.png')}
          />
        </View>
      </View>
      <View
        style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={data}
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

                {!listFriend.find(f => f._id === item._id) ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: width * 0.1,
                    }}>
                    <Pressable
                      onPress={() => {
                        FriendApi.sendFriendRequest({receiverId:item._id,senderId:user._id})
                      }}>
                      <Icon
                        source={require('../assets/icon/add-user.png')}
                        size={28}
                        color={Colors.darkOrange}
                      />
                    </Pressable>
                  </View>
                ) : (
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
                )}
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchUserScreen;

const styles = StyleSheet.create({});
