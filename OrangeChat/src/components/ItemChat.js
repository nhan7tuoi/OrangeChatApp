import React from 'react';
import { View, Text, Pressable, Image, FlatList } from 'react-native';

const ItemChat = ({ item, navigation }) => {
    return (
        <FlatList
            data={[1]}
            renderItem={({ item }) => {
                return (
                    <Pressable
                        onPress={() => navigation.navigate('ChatScreen')}
                        style={{ width: '100%', height: 70, flexDirection: 'row' }}>
                        <View style={{ width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/image/avt1.png')} />
                            {/* online */}
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
                            {/* offline */}
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
                )
            }}
        />
    );
}

export default ItemChat;
