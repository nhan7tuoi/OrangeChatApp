import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox, TextInput } from 'react-native-paper';
import i18next from '../i18n/i18n';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../themes/Colors';
import { setAuth } from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


const URL_API_LOGIN = 'http://192.168.2.58:3000/api/v1/login';



const LoginScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  i18next.changeLanguage(selectedLanguage);


  const handleLogin = async () => {
    try {
      const response = await fetch(URL_API_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        await AsyncStorage.setItem(
          'accessToken',
          isChecked ? JSON.stringify(responseData.accessToken) : ''
        );
        
        dispatch(setAuth({
          user: responseData.user,
          accessToken: responseData.accessToken
        }));
        // Alert.alert('Đăng nhập thành công');

      } else {
        throw new Error('Tên người dùng hoặc mật khẩu không đúng.');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black }}>
      <View style={{
        height: '40%',
        gap: 20,
      }}>
        <TextInput
          label={i18next.t('taiKhoan')}
          style={{
            marginTop: 20,
            backgroundColor: Colors.white,
            borderColor: Colors.primary,
            borderWidth: 2,
            fontWeight: 'bold',
            fontSize: 20,
            borderBottomWidth: 3
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
            borderBottomWidth: 3
          }}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry={!passwordVisible}
          right={
            <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
          }
        />
        <View style={{ flexDirection: 'row' }}>
          <Checkbox.Android status={isChecked ? 'checked' : 'unchecked'} color={Colors.primary}
            onPress={() => {
              setIsChecked(!isChecked);
            }} />
          <Text style={{ color: Colors.white, textAlignVertical: 'center' }}>{i18next.t('ghiNho')}</Text>
        </View>
        <Pressable style={{
          alignSelf: 'center',
          width: 200,
          height: 60,
          backgroundColor: Colors.primary,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => {
            handleLogin();
          }}
        >
          <Text style={{
            color: Colors.white,
            fontSize: 20,
            fontWeight: 'bold'
          }}>{i18next.t('dangNhap')}</Text>
        </Pressable>
        <Pressable onPress={()=>{navigation.navigate('ForgotPassword')}}
        style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.primary }}>{i18next.t('quenMatKhau')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;
