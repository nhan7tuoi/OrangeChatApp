import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Checkbox, TextInput} from 'react-native-paper';
import i18next from '../i18n/i18n';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../themes/Colors';
import {setAuth} from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../apis/authApi';
import connectSocket from '../server/ConnectSocket';

const LoginScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  i18next.changeLanguage(selectedLanguage);

  const handleLogin = async () => {
    try {
      const response = await authApi.login({
        username: username,
        password: password,
      });
      await AsyncStorage.setItem(
        'accessToken',
        isChecked ? response.accessToken : '',
      );

      dispatch(
        setAuth({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );
      connectSocket.initSocket();
      connectSocket.emit('user login',response.user._id);
    } catch (error) {
      Alert.alert(
        i18next.t('dangNhapThatBai'),
        i18next.t('taiKhoanMatKhauKhongChinhSac'),
      );
    }
  };


  useEffect(() => {
    if (username !== '' && password !== '') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [username, password]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.black}}>
      <View
        style={{
          height: '40%',
          gap: 20,
        }}>
        <TextInput
          label={i18next.t('email')}
          style={{
            marginTop: 20,
            backgroundColor: Colors.white,
            borderColor: Colors.primary,
            borderWidth: 2,
            fontWeight: 'bold',
            fontSize: 20,
            borderBottomWidth: 3,
          }}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          label={i18next.t('matKhau')}
          style={{
            backgroundColor: Colors.white,
            borderColor: Colors.primary,
            borderWidth: 2,
            fontWeight: 'bold',
            fontSize: 20,
            borderBottomWidth: 3,
          }}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={!passwordVisible}
          right={
            <TextInput.Icon
              icon={passwordVisible ? 'eye-off' : 'eye'}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
        />
        <View style={{flexDirection: 'row'}}>
          <Checkbox.Android
            status={isChecked ? 'checked' : 'unchecked'}
            color={Colors.primary}
            onPress={() => {
              setIsChecked(!isChecked);
            }}
          />
          <Text style={{color: Colors.white, textAlignVertical: 'center'}}>
            {i18next.t('ghiNho')}
          </Text>
        </View>
        <Pressable
          style={
            isLogin
              ? {
                  alignSelf: 'center',
                  width: 200,
                  height: 60,
                  backgroundColor: Colors.primary,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              : {
                  alignSelf: 'center',
                  width: 200,
                  height: 60,
                  backgroundColor: Colors.grey,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
          }
          onPress={() => {
            handleLogin();
          }}
          disabled={!isLogin}>
          <Text
            style={{
              color: Colors.white,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {i18next.t('dangNhap')}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: Colors.primary}}>
            {i18next.t('quenMatKhau')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
