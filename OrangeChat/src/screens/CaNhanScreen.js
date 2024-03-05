
import React from 'react';
import { View, Text, Image, TextInput, Pressable, KeyboardAvoidingView,Platform,Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18next from '../i18n/i18n';
import { useSelector } from 'react-redux';
import ItemChat from '../components/ItemChat';
import Colors from '../themes/Colors';


const CaNhanScreen = ({navigation,route}) => {
  const windowHeight = Dimensions.get('window').height;
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  const user = useSelector((state) => state.auth.user);

  console.log('user', user);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
        <View style={{ height: windowHeight*0.15, justifyContent: 'center', alignItems: 'center', gap: 20, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{i18next.t('doanChat')}</Text>
            <Pressable style={{ left: 130 }}>
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
          <ItemChat navigation={navigation} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default CaNhanScreen;
