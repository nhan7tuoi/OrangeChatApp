import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../themes/Colors';
import i18n from '../i18n/i18n';


const TaiKhoanScreen = () => {


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
      <View style={{ height: '35%', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold' }}>{i18n.t('me')}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image resizeMode='contain' style={{ width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: Colors.primary }} source={require('../assets/image/avt1.png')} />
        </View>
        <Text style={{ color: Colors.white, fontSize: 24, fontWeight: 'bold' }}>Phạm Đức Nhân</Text>
      </View>
      <View style={{ height: '65%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold' }}>
            {i18n.t('ngonNgu')}
          </Text>
          
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TaiKhoanScreen;
