import {Pressable, StyleSheet, Text, TextInput, View,Image,FlatList,Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../themes/Colors';
import i18next from '../i18n/i18n';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchFriends, setFriends} from '../redux/friendSlice';
import connectSocket from '../server/ConnectSocket';
import conversationApi from '../apis/conversationApi';
import {setConversations} from '../redux/conversationSlice';


const {width, height} = Dimensions.get('window');


const ForwardScreen = ({route}) => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  const listConversations = useSelector(
    state => state.conversation.conversations,
  );
  const [keyword, setKeyword] = useState('');
  useEffect(() => {
    if (keyword === '') {
      getConversation();
    } else {
      const data = listConversations.filter(
        c => f.nameGroup.includes(keyword) || f.members.includes(keyword),
      );
      dispatch(setFriends(data));
    }
  }, [keyword]);

  const getConversation = async () => {
    try {
      const response = await conversationApi.getConversation({
        userId: user._id,
      });

      if (response) {
        response.data.forEach(c => {
          if (c.nameGroup === '') {
            const newName = '';
            const tempMembers = c.members.filter(m => m._id !== user._id);
            if (c.isGroup == false) {
              newName = tempMembers[0].name;
              c.image = tempMembers[0].image;
            } else {
              newName =
                i18next.t('ban') +
                ', ' +
                tempMembers[0].name +
                '+ ' +
                (tempMembers.length - 1) +
                ' ' +
                i18next.t('nguoiKhac');
            }
            c.nameGroup = newName;
          }
        });
        dispatch(setConversations(response.data));
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const forwardMessage = conversation => {
    console.log(conversation);
    connectSocket.emit('forward message', {
      conversation: conversation,
      msg: route?.params?.msg,
      senderId: user._id,
    });
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          onChangeText={setKeyword}
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
        <View
          style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
          <FlatList
            data={listConversations}
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
                      style={{width: 55, height: 55, borderRadius: 27.5}}
                    />
                  </View>
                  <View
                    style={{
                      width: width * 0.5,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: Colors.white,
                      }}>
                      {item.nameGroup}
                    </Text>
                  </View>
                  <View>
                    <Pressable onPress={() => forwardMessage(item)}>
                      <Text>Send</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForwardScreen;

const styles = StyleSheet.create({});
