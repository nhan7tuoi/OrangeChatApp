import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import i18next from '../i18n/i18n';
import {useSelector, useDispatch} from 'react-redux';
import Conversation from '../components/conversation';
import Colors from '../themes/Colors';
import conversationApi from '../apis/conversationApi';
import {
  setConversationGroups,
  setConversations,
} from '../redux/conversationSlice';
import connectSocket from '../server/ConnectSocket';
import {useFocusEffect} from '@react-navigation/native';
import {formatConversation} from '../utils/formatConversation';
import Icons from '../themes/Icons';
import ConversationGroup from '../components/conversationGroup';

const NhomScreen = ({navigation}) => {
  const {width, height} = Dimensions.get('window');
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const user = useSelector(state => state.auth.user);
  const conversations = useSelector(
    state => state.conversation.conversationGroups,
  );
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );
  useEffect(() => {
    connectSocket.on('newGroupName', data => {
      fetchData();
    });
  }, []);
  const fetchData = async () => {
    try {
      const res = await conversationApi.getConversationGroups({
        userId: user._id,
      });
      if (res) {
        const fConversation = formatConversation({
          data: res.data,
          userId: user._id,
        });
        dispatch(setConversationGroups(fConversation));
      }
    } catch (error) {
      console.error('Error fetching data a:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{
          height: height * 0.15,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          paddingTop: 20,
          marginBottom: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.navigate('TaiKhoan')}>
            <Image
              style={{width: 40, height: 40, borderRadius: 20}}
              source={{uri: user.image}}
            />
          </Pressable>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            {i18next.t('chatNhom')}
          </Text>
          {/* tao nhom */}
          <Pressable onPress={() => navigation.navigate('CreateGroup')}>
            {Icons.Icons({name: 'check', width: 30, height: 30})}
          </Pressable>
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
            placeholder={i18next.t('timKiem')}
            placeholderTextColor={Colors.white}
            cursorColor={Colors.white}
          />
          <View style={{position: 'absolute', left: 50, width: 24, height: 24}}>
            {Icons.Icons({name: 'search', width: 22, height: 22})}
          </View>
        </View>
      </View>
      <View style={{height:height*0.75}}>
        {/* <Conversation navigation={navigation} data={conversations} /> */}
        <ConversationGroup navigation={navigation} data={conversations} />
      </View>
    </SafeAreaView>
  );
};

export default NhomScreen;
