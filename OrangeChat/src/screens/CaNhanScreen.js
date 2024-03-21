import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18next from '../i18n/i18n';
import { useSelector,useDispatch } from 'react-redux';
import ItemChat from '../components/ItemChat';
import Colors from '../themes/Colors';
import conversationApi from '../apis/conversationApi';
import { setConversations } from '../redux/conversationSlice';




const CaNhanScreen = ({ navigation, route }) => {
  const windowHeight = Dimensions.get('window').height;
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversation.conversations);

  useEffect(() => {
    getConversation();
  }, [navigation]);

  const getConversation = async () => {
    try {
      const response = await conversationApi.getConversation({ userId: user._id });
      
      if (response) {
        console.log('response', response.data[0].lastMessage.receiverId._id);
        console.log('user', user._id);
        console.log('response', response.data);
        dispatch(setConversations(response.data));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
        <View style={{ height: windowHeight * 0.15, justifyContent: 'center', alignItems: 'center', gap: 20, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pressable onPress={() => navigation.navigate('TaiKhoan')}>
              <Image style={{ width: 40, height: 40 }} source={{ uri: user.image }} />
            </Pressable>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{i18next.t('doanChat')}</Text>
            <Pressable >
              <Image source={require('../assets/icon/Vectorfriends.png')} />
            </Pressable>
          </View>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput style={{
              width: '80%',
              height: 50,
              backgroundColor: Colors.grey,
              borderRadius: 10,
              fontSize: 18,
              paddingLeft: 40,
              color: Colors.white
            }}
              placeholder={i18next.t('timKiem')}
              placeholderTextColor={Colors.white}
              cursorColor={Colors.white}
            />
            <Image style={{ position: 'absolute', left: 50, width: 24, height: 24 }} source={require('../assets/icon/Vectorsearch.png')} />
          </View>
        </View>
        <View style={{ height: '85%', marginTop: 15 }}>
          <ItemChat navigation={navigation} item={conversations}/>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default CaNhanScreen;
