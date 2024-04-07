import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../themes/Colors';


const FirstMessage = ({item,index}) => {
    return (
        <View key={index} style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Chào mừng bạn đến với OrangeC - Nơi gắn kết bạn bè online</Text>
        </View>
    );
}

export default FirstMessage;
