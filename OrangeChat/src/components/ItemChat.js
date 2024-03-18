import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

const ItemChat = ({ item, navigation, router }) => {
    const user = useSelector((state) => state.auth.user);
    const [isUser, setIsUser] = useState(false);
    const [isReadyToRender, setIsReadyToRender] = useState(false);

    const a = item[0]?.lastMessage?.receiverId?._id;
    const b = user?._id;
    console.log('a', a);
    console.log('b', b);
    useEffect(() => {
        if (a == b) {
            setIsUser(true);
            setIsReadyToRender(true);
        }else {
            setIsReadyToRender(true);
        }
        
    }, [a, b]);

    return (
        <>
            {isReadyToRender && (
                <FlatList
                    data={item}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                onPress={() => navigation.navigate('ChatScreen',
                                    isUser ? {
                                        receiverId: item?.lastMessage.senderId._id,
                                        conversationId: item?.conversation._id,
                                        receiverImage: item?.lastMessage.senderId.image,
                                        receiverName: item?.lastMessage.senderId.name

                                    } : {
                                        receiverId: item?.lastMessage.receiverId._id,
                                        conversationId: item?.conversation._id,
                                        receiverImage: item?.lastMessage.receiverId.image,
                                        receiverName: item?.lastMessage.receiverId.name
                                    }
                                )}
                                style={{ width: '100%', height: 70, flexDirection: 'row' }}>
                                <View style={{ width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: 56, height: 56 }} source={
                                        isUser ? { uri: item?.lastMessage?.senderId?.image } : { uri: item?.lastMessage?.receiverId?.image }
                                    } />
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
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{
                                        isUser ? item?.lastMessage?.senderId?.name : item?.lastMessage?.receiverId?.name
                                    }</Text>
                                    <Text style={{ color: 'gray' }}>{
                                        item?.lastMessage?.contentMessage
                                    }</Text>
                                </View>
                                <View style={{ width: '15%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Pressable style={{ width: 14, height: 14, backgroundColor: 'blue', borderRadius: 7 }} />
                                </View>
                            </Pressable>
                        )
                    }}
                />
            )}
        </>
    );
}

export default ItemChat;
