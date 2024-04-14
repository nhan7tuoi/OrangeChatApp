import {
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import i18next from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import conversationApi from '../apis/conversationApi';
import {launchImageLibrary} from 'react-native-image-picker';
import messageApi from '../apis/messageApi';
import connectSocket from '../server/ConnectSocket';
import { setNameGroup } from '../redux/conversationSlice';

const InforGroupScreen = ({navigation,route}) => {
  const conversation = route?.params;
  const avatarGroup = useRef(conversation.image).current;
  const user = useSelector(state => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(conversation.nameGroup);
  const dispatch = useDispatch();

  const onSelectAvatar = async () => {
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 1},
      async response => {
        if (!response.didCancel) {
          const selectedImage = response.assets[0];
          try {
            const formData = new FormData();
            formData.append('image', {
              uri: selectedImage.uri,
              type: selectedImage.type,
              name: selectedImage.fileName,
            });

            try {
              const uploadResponse = await messageApi.uploadFile(formData);
              const avatarUrl = uploadResponse.data;
              if (avatarUrl) {
                console.log('avatarUrl', avatarUrl);
                const response = await conversationApi.uploadAvatar({
                  conversationId: conversation._id,
                  image: avatarUrl,
                });
                console.log('response', response);
                avatarGroup.current(avatarUrl);
              }
            } catch (error) {
              console.error('Error uploading avatar:', error);
            }
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      },
    );
  };
  const handleChangeName = () => {
    connectSocket.emit('change name group', {
      conversation: conversation,
      newName: newName,
    });
    dispatch(setNameGroup(newName));
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <Pressable onPress={() => onSelectAvatar()}>
          <Image
            source={{uri: avatarGroup}}
            style={{width: 100, height: 100, borderRadius: 50}}
          />
          <View style={{position: 'absolute', right: 0, bottom: 5}}>
            {Icons.Icons({name: 'camera', width: 20, height: 20})}
          </View>
        </Pressable>
        <View>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 17,
                color: Colors.white,
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary,
                padding: 5,
                fontWeight: '700',
              }}>
              {newName}
            </Text>
            {Icons.Icons({name: 'edit', width: 30, height: 30})}
          </Pressable>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: Colors.grey,
                  borderRadius: 20,
                  width: '80%',
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 5,
                }}>
                <TextInput
                  placeholder="Nhập tên mới"
                  onChangeText={setNewName}
                  value={newName}
                  style={{
                    width: '100%',
                    marginBottom: 20,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    fontSize: 16,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: 200,
                  }}>
                  <Pressable
                    style={{
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      setModalVisible(false);
                      setNewName(conversation.nameGroup);
                    }}>
                    <Text>{i18next.t('huy')}</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: Colors.primary,
                      padding: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => handleChangeName()}>
                    <Text style={{fontSize: 16, fontWeight: '600'}}>
                      {i18next.t('dongY')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View>
        <Pressable
        onPress={()=>{
            navigation.navigate('AddMember',conversation);
        }}
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'edit', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('themThanhVien')}
          </Text>
        </Pressable>
        <Pressable
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'edit', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('xemThanhVien')}
          </Text>
        </Pressable>
        <Pressable
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'edit', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('media')}
          </Text>
        </Pressable>
        {conversation.administrators.find(m => m === user._id) ? (
          <Pressable
            style={{
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderColor: Colors.grey,
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <View style={{width: '10%'}}>
              {Icons.Icons({name: 'edit', width: 30, height: 30})}
            </View>
            <Text
              style={{
                fontSize: 16,
                color: Colors.white,
                fontWeight: '600',
                width: '90%',
              }}>
              {i18next.t('giaiTan')}
            </Text>
          </Pressable>
        ) : null}

        <Pressable
          style={{
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderColor: Colors.grey,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{width: '10%'}}>
            {Icons.Icons({name: 'edit', width: 30, height: 30})}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: Colors.white,
              fontWeight: '600',
              width: '90%',
            }}>
            {i18next.t('roiNhom')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InforGroupScreen;

const styles = StyleSheet.create({});
