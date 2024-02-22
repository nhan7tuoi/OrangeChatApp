import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import i18next from '../i18n/i18n';
import { useSelector } from 'react-redux';
import Colors from '../themes/Colors';



const LoginScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  i18next.changeLanguage(selectedLanguage);
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
          secureTextEntry={!passwordVisible}
          right={
          <TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />
        }
        />
        <Pressable style={{
          alignSelf: 'center',
          width: 200,
          height: 60,
          backgroundColor: Colors.primary,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={()=>{
          navigation.navigate('Tab');
        }}
        >
          <Text style={{
            color: Colors.white,
            fontSize: 20,
            fontWeight: 'bold'
          }}>{i18next.t('dangNhap')}</Text>
        </Pressable>
        <Pressable style={{alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:Colors.primary}}>{i18next.t('quenMatKhau')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;
