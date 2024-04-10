import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import i18next from 'i18next';
import Icons from '../themes/Icons';

const NhomScreen = ({navigation}) => {
  const selectedLanguage = useSelector(
    state => state.language.selectedLanguage,
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View
        style={{
          height: windowHeight * 0.15,
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
          <Pressable>
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
    </SafeAreaView>
  );
};

export default NhomScreen;
