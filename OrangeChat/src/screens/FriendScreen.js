import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18next from 'i18next';
import FriendApi from '../apis/FriendApi';
import {useSelector} from 'react-redux';

const FriendScreen = ({navigation, route}) => {
  const user = useSelector(state => state.auth.user);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await FriendApi.getFriends({userId: user._id});
        setData(res.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchData();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
        <View
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
          />
          <Image
            style={{position: 'absolute', left: 50, width: 24, height: 24}}
            source={require('../assets/icon/Vectorsearch.png')}
          />
        </View>
        <View>
          <FlatList
            data={data}
            renderItem={({item}) => {
            
              return (
                <View>
                  <Image source={{uri:item.image}} style={{width:40,height:40}}/>
                  <Text>{item.name}</Text>
                  <View>
                    <Pressable><Text>Chat</Text></Pressable>
                    <Pressable><Text>Xóa</Text></Pressable>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({});
