
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, Dimensions, ImageBackground, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutogrowInput from 'react-native-autogrow-input'
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';

import mess from '../data';

const windowHeight = Dimensions.get('window').height;


const ChatScreen = ({ navigation }) => {
    const scrollViewRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const userId = 1;

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollToBottom();
        }
    }, [scrollViewRef.current]);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current?.scrollToEnd({ animated: false })
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            scrollToBottom();
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        setMessages(mess);
    }, [])

    const handleInputText = (text) => {
        setInputMessage(text);
    };

    const onSend = () => {
        if (!inputMessage.trim()) {
            return;
        }
        const newMessage = {
            idMessemger: messages.length + 1,
            user: {
                _id: 1,
                nameUserSend: 'Phạm Đức Nhân',
                avatarUserSend: './src/assets/images/avatar.jpg',
            },
            receiver: {
                _id: 2,
                nameReceiver: 'Nguyễn Nhật Sang',
                avatarReceiver: require('../assets/image/avt2.png'),
            },
            messengerType: 'TEXT',
            messengerContent: inputMessage,
            createdAt: new Date(),
            sent: 1,
            received: 1,
        };
        setMessages(previousMessages => [...previousMessages, newMessage]);

        setInputMessage('');
    };

    const onSelectImage = async () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, (response) => {
            if (!response.didCancel) {
                console.log(response);
                const newMessages = response.assets.map((asset, index) => ({
                    idMessemger: messages.length + 1,
                    user: {
                        _id: 1,
                        nameUserSend: 'Phạm Đức Nhân',
                        avatarUserSend: './assets/images/avatar.jpg',
                    },
                    receiver: {
                        _id: 2,
                        nameReceiver: 'Nguyễn Nhật Sang',
                        avatarReceiver: require('../assets/image/avt2.png'),
                    },
                    messengerType: 'IMAGE',
                    urlImage: require('../assets/image/anh4.jpg'),
                    createdAt: new Date(),
                    sent: 1,
                    received: 1,
                }));
                setMessages(previousMessages => [...previousMessages, ...newMessages]);
                console.log(newMessages);
            }
        });
    };

    const onSelectFile = async () => {
        try {
            const res = await DocumentPicker.pick();
            console.log('res' + res[0]);
            console.log(
                'URI : ' + res[0].uri,
                'Type : ' + res[0].type,
                'File Size : ' + res[0].size,
                'File Name : ' + res[0].name
            );
            // Xử lý tệp đã chọn ở đây, có thể gửi tệp qua API hoặc xử lý trực tiếp
            const newMessage = {
                _id: messages.length + 1,
                uriFile: res[0].uri,
                text: res[0].name,
                typeFile: res[0].type,
                createdAt: new Date(),
                user: { _id: 1 },
                sent: true,
                received: true,
                file: 1
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Hủy chọn tệp');
            } else {
                console.log('Lỗi khi chọn tệp: ' + err);
            }
        }
    };

    const openFile = (uriFile, typeFile) => {
        // Thực hiện các thao tác mở tệp ở đây, ví dụ:
        // Mở một trình xem tệp hoặc trình duyệt web
        console.log('Mở tệp: ' + uriFile);
        console.log('Loại tệp: ' + typeFile);
    };

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    return (
        // <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
            {/* header */}
            <View style={{
                height: windowHeight * 0.1, flexDirection: 'row', backgroundColor: Colors.black,
            }}>
                <View style={{ width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={{
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {Icons.Icons({ name: 'iconBack', width: 16, height: 24 })}
                    </Pressable>
                </View>
                <View style={{ width: '50%', height: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '40%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 54, height: 54 }} source={require('../assets/image/avt1.png')} />
                        <Pressable style={{
                            position: 'absolute',
                            backgroundColor: Colors.primary,
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: Colors.white,
                            bottom: 14,
                            right: 20
                        }} />
                    </View>
                    <View style={{ width: '60%', height: '100%', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>Phạm Đức Nhân</Text>
                        <Text style={{ color: Colors.grey, fontSize: 12 }}>Đang hoạt động</Text>
                    </View>
                </View>
                <View style={{ width: '40%', height: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 30 }}>
                    <Pressable
                        style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconCall', width: 22, height: 22 })}
                    </Pressable>
                    <Pressable style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconVideoCall', width: 22, height: 22 })}
                    </Pressable>
                    <Pressable style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconOther', width: 22, height: 22 })}
                    </Pressable>
                </View>
            </View>
            {/* body */}
            <View style={{ flex: 8, backgroundColor: Colors.backgroundChat }}>
                <ImageBackground source={require('../assets/image/anh2.jpg')} style={{ flex: 1 }}>
                    <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                        {messages.map((item, index) => {
                            if (item.messengerType === "TEXT") {
                                // const isSelected = 
                                return (
                                    <View key={index} style={[
                                        item?.user?._id === userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                                        {
                                            flexDirection: 'row',
                                            paddingLeft:10
                                        }
                                    ]}>
                                        {item?.user?._id !== userId && (
                                            <Image source={item?.receiver.avatarReceiver}
                                                style={{ width: 32, height: 32, borderRadius: 16}}
                                            />
                                        )}
                                        <Pressable
                                            onPress={() => { }}
                                            style={[
                                                {
                                                    backgroundColor: Colors.bubble,
                                                    maxWidth: '60%',
                                                    padding: 2,
                                                    borderRadius: 10,
                                                    margin: 10,
                                                    minWidth:'20%'
                                                },
                                            ]}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                padding: 3,
                                                color: Colors.white,
                                                fontWeight: 600

                                            }}>
                                                {item.messengerContent}
                                            </Text>
                                            <Text style={[
                                                {
                                                    fontSize: 12,
                                                    paddingHorizontal: 2
                                                },
                                                item?.user?._id === userId ? { textAlign: "right" } : { textAlign: "left" }
                                            ]}>
                                                {formatTime(item.createdAt)}
                                            </Text>
                                            <Pressable style={[
                                                {position:'absolute',width:18,height:18,borderRadius:9,backgroundColor:Colors.grey,justifyContent:'center',alignItems:'center'},
                                                item?.user?._id === userId ? { left: 5,bottom:-5 } : { right: 5,bottom:-5 }
                                            ]}>
                                                {Icons.Icons({ name: 'iconTym', width: 13, height: 13 })}
                                            </Pressable>
                                        </Pressable>

                                    </View>
                                )
                            };

                            if (item.messengerType === "IMAGE") {
                                return (
                                    <View key={index} style={[
                                        item?.user?._id === userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                                        {
                                            flexDirection: 'row',
                                            paddingLeft:10
                                        }
                                    ]}>
                                        {item?.user?._id !== userId && (
                                            <Image source={item?.receiver.avatarReceiver}
                                                style={{ width: 32, height: 32, borderRadius: 16 }}
                                            />
                                        )}
                                        <Pressable
                                            style={[
                                                {
                                                    backgroundColor: Colors.bubble,
                                                    maxWidth: '60%',
                                                    padding: 2,
                                                    borderRadius: 10,
                                                    margin: 10,
                                                }
                                            ]}
                                        >
                                            <View>
                                                <Image source={item?.urlImage}
                                                    style={{ width: 200, height: 200, borderRadius: 10 }}
                                                />
                                                <Text
                                                    style={[
                                                        {
                                                            fontSize: 12,
                                                            paddingHorizontal: 2,
                                                            paddingTop: 3
                                                        },
                                                        item?.user?._id === userId ? { textAlign: "right" } : { textAlign: "left" }
                                                    ]}>
                                                    {formatTime(item?.createdAt)}
                                                </Text>
                                            </View>
                                            <Pressable style={[
                                                {position:'absolute',width:18,height:18,borderRadius:9,backgroundColor:Colors.grey,justifyContent:'center',alignItems:'center'},
                                                item?.user?._id === userId ? { left: 5,bottom:-5 } : { right: 5,bottom:-5 }
                                            ]}>
                                                {Icons.Icons({ name: 'iconTym', width: 13, height: 13 })}
                                            </Pressable>
                                        </Pressable>
                                    </View>
                                )
                            }
                        })}
                    </ScrollView>
                </ImageBackground>
            </View>
            {/* footer */}
            <View style={{ height: windowHeight * 0.1, flexDirection: 'row', backgroundColor: Colors.black }}>
                <View style={{ width: '35%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 20 }}>
                    <Pressable
                        onPress={() => {
                            onSelectImage()
                        }}
                    >
                        {Icons.Icons({ name: 'iconImage', width: 22, height: 22 })}
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            onSelectFile()
                        }}
                    >
                        {Icons.Icons({ name: 'iconFile', width: 22, height: 22 })}
                    </Pressable>
                    <Pressable>
                        {Icons.Icons({ name: 'iconIcon', width: 22, height: 22 })}
                    </Pressable>
                </View>
                <View style={{ width: '55%', justifyContent: 'center', alignItems: 'center' }}>
                    <AutogrowInput
                        maxHeight={50}
                        minHeight={30}
                        placeholder={'Aa'}
                        defaultHeight={30} style={{
                            backgroundColor: Colors.white,
                            fontSize: 16,
                            borderRadius: 10,
                            width: '100%',
                            paddingLeft: 10,
                            paddingRight: 10,
                        }}
                        value={inputMessage}
                        onChangeText={handleInputText} />
                </View>
                <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => {
                            onSend()
                        }}
                        style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                        {Icons.Icons({ name: 'iconSend', width: 22, height: 22 })}
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
        // </KeyboardAvoidingView>
    );
}

export default ChatScreen;