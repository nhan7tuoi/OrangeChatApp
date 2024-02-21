
import React from 'react';
import { View, Text, Image, TextInput, Pressable, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18next from '../i18n/i18n';
import { useSelector } from 'react-redux';

const CaNhanScreen = () => {
  const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
  console.log(selectedLanguage);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.90)' }}>
      <View style={{ height: '15%', justifyContent: 'center', alignItems: 'center', gap: 20, paddingTop: 20 }}>
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
            backgroundColor: 'gray',
            borderRadius: 10,
            fontSize: 18,
            paddingLeft: 40,
            color: 'white'
          }}
            placeholder={i18next.t('timKiem')}
            placeholderTextColor={'white'}
            cursorColor={'white'}
          />
          <Image style={{ position: 'absolute', left: 50, width: 24, height: 24 }} source={require('../assets/icon/Vectorsearch.png')} />
        </View>
      </View>
      <View style={{ height: '85%', marginTop: 15 }}>
        <FlatList

          data={[1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20]}
          renderItem={({ item }) => {
            return (
              <Pressable style={{ width: '100%', height: 70, flexDirection: 'row' }}>
                <View style={{ width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={require('../assets/image/avt1.png')} />
                  {/* <Pressable style={{
              position:'absolute',
              backgroundColor:'rgba(238, 102, 25, 1)',
              width:12,
              height:12,
              borderRadius:6,
              borderWidth:1,
              borderColor:'white',
              bottom:5,
              right:20
              }}/> */}
                  <Pressable style={{
                    position: 'absolute',
                    backgroundColor: 'black',
                    width: 40,
                    height: 15,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(238, 102, 25, 1)',
                    bottom: 5,
                    right: 5,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: 'rgba(238, 102, 25, 1)', fontSize: 8 }}>59 phút</Text>
                  </Pressable>
                </View>
                <View style={{ width: '65%', height: '100%', justifyContent: 'center', paddingLeft: 10, gap: 5 }}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Phạm Đức Nhân</Text>
                  <Text style={{ color: 'gray' }}>Bạn: Hello u !!! - 5:00am</Text>
                </View>
                <View style={{ width: '15%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Pressable style={{ width: 14, height: 14, backgroundColor: 'blue', borderRadius: 7 }} />
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default CaNhanScreen;
