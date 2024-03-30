
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, Dimensions, ImageBackground, ScrollView, Keyboard, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutogrowInput from 'react-native-autogrow-input'
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import connectSocket from '../server/ConnectSocket';
import { useSelector, useDispatch } from 'react-redux';
import { setConversations } from '../redux/conversationSlice';
import conversationApi from '../apis/conversationApi';
import messageApi from '../apis/messageApi';

import Reaction from '../components/reaction';



import Lightbox from 'react-native-lightbox-v2';



const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const ChatScreen = ({ navigation, route }) => {
    const { receiverId, conversationId, receiverImage, receiverName } = route.params;
    const scrollViewRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const dispatch = useDispatch();
    const userId = user._id;
    const showGif = useRef(new Animated.Value(0)).current;
    const [showReactionIndex, setShowReactionIndex] = useState(-1);
    const [selectedReactions, setSelectedReactions] = useState({});

    const toggleReaction = (index) => {
        if (showReactionIndex === index) {
            setShowReactionIndex(-1); // Nếu ô message đã hiển thị reaction thì ẩn reaction đi
        } else {
            setShowReactionIndex(index); // Nếu người dùng click vào ô message mới, cập nhật index của ô message và hiển thị reaction
        }
    };
    const onSelectReaction = (index, reaction) => {
        setSelectedReactions({ ...selectedReactions, [index]: reaction });
        console.log(selectedReactions);
        setShowReactionIndex(-1);
    };

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

    const handleInputText = (text) => {
        setInputMessage(text);
    };

    const onSend = () => {
        if (!inputMessage.trim()) {
            return;
        }
        const newMessage = {
            conversationId: conversationId,
            senderId: userId,
            receiverId: receiverId,
            type: "text",
            contentMessage: inputMessage,
            urlType: "",
            createAt: new Date(),
            isDeleted: false,
            reaction: [],
            isSeen: false,
            isReceive: false,
            isSend: false,
        };
        setMessages([...messages, newMessage]);
        setInputMessage('');
        sendMessage(newMessage);

    };

    const onSelectImage = async () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, async (response) => {
            if (!response.didCancel) {
                const selectedImages = [];

                try {
                    // Sử dụng Promise.all để chờ cho tất cả các yêu cầu tải lên hoàn thành
                    await Promise.all(response.assets.map(async (image) => {
                        const formData = new FormData();
                        formData.append('image', {
                            uri: image.uri,
                            type: image.type,
                            name: image.fileName
                        });

                        try {
                            const uploadResponse = await messageApi.uploadFile(formData);
                            const imageUrl = uploadResponse.data;
                            selectedImages.push(imageUrl);
                            console.log(uploadResponse.data);
                        } catch (error) {
                            console.error('Error uploading image:', error);
                        }
                    }));

                    const newMessage = {
                        conversationId: conversationId,
                        senderId: userId,
                        receiverId: receiverId,
                        type: "image",
                        urlType: selectedImages,
                        createAt: new Date(),
                        isDeleted: false,
                        reaction: [],
                        isSeen: false,
                        isReceive: false,
                        isSend: false,
                    };
                    setMessages([...messages, newMessage]);
                    sendMessage(newMessage);
                } catch (error) {
                    console.error('Error processing images:', error);
                }
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

    const showIcon = () => {
        Animated.timing(showGif, {
            toValue: 300,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            scrollToBottom()
        });
    }
    const hideIcon = () => {
        console.log('hide');
        Animated.timing(showGif, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
        }).start();
    }

    //////////////////////////////////////////

    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    useEffect(() => {
        connectSocket.initSocket();
        getMessage();
    }, [])

    //ham get message
    const getMessage = async () => {
        const response = await messageApi.getMessage({ conversationId: conversationId });
        if (response) {
            setMessages(response.data);
        }
    }

    //upadate message
    useEffect(() => {
        // gửi sự kiên cho mọi người update lại tin nhắn
        connectSocket.on('conversation updated', () => {
            getMessage();
            getConversation();
        });
    }, [messages]);

    //send message
    const sendMessage = (message) => {
        connectSocket.emit('chat message', message);
    };

    //get conversation
    const getConversation = async () => {
        try {
            const response = await conversationApi.getConversation({ userId: user._id });

            if (response) {
                console.log('update');
                dispatch(setConversations(response.data));
            }
        } catch (error) {
            console.log('error', error);
        }
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
                        <Image style={{ width: 54, height: 54 }} source={{ uri: receiverImage }} />
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
                    <View style={{ width: '70%', height: '100%', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>{
                            receiverName
                        }</Text>
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
                    <Pressable
                        style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconOther', width: 22, height: 22 })}
                    </Pressable>
                </View>
            </View>
            {/* body */}
            <Pressable style={{ flex: 8, backgroundColor: Colors.backgroundChat }} onPress={() => {
                hideIcon();
                setShowReactionIndex(-1);
            }}>
                <ImageBackground source={require('../assets/image/anh2.jpg')} style={{ flex: 1 }} >
                    <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }} onContentSizeChange={handleContentSizeChange}>
                        {messages.map((item, index) => {
                            if (item.type === "text") {
                                return (
                                    <View key={index} style={[
                                        item?.senderId === userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                                        {
                                            flexDirection: 'row',
                                            paddingLeft: 10
                                        }
                                    ]}>
                                        {item?.senderId !== userId && (
                                            <Image source={{ uri: receiverImage }}
                                                style={{ width: 32, height: 32, borderRadius: 16 }}
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
                                                    minWidth: '20%'
                                                },
                                            ]}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                padding: 3,
                                                color: Colors.white,
                                                fontWeight: 600

                                            }}>
                                                {item.contentMessage}
                                            </Text>
                                            <Text style={[
                                                {
                                                    fontSize: 12,
                                                    paddingHorizontal: 2
                                                },
                                                item?.senderId === userId ? { textAlign: "right" } : { textAlign: "left" }
                                            ]}>
                                                {formatTime(item.createAt)}
                                            </Text>
                                            <Pressable
                                                onPress={() => {
                                                    toggleReaction(item._id)
                                                }}
                                                style={[
                                                    { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.grey, justifyContent: 'center', alignItems: 'center' },
                                                    item?.senderId === userId ? { left: 5, bottom: -5 } : { right: 5, bottom: -5 }
                                                ]}>

                                                {Icons.Icons({
                                                    name: item?.reaction[0]?.type ? item?.reaction[0]?.type : 'iconTym',
                                                    width: 13,
                                                    height: 13
                                                })}
                                            </Pressable>

                                            {(showReactionIndex == item._id) && (
                                                <Reaction onSelectReaction={onSelectReaction} item={item} />
                                            )}

                                        </Pressable>

                                    </View>
                                )
                            };

                            if (item.type === "image") {
                                return (
                                    <View key={index} style={[
                                        item?.senderId === userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                                        {
                                            flexDirection: 'row',
                                            paddingLeft: 10
                                        }
                                    ]}>
                                        {item?.senderId !== userId && (
                                            <Image source={{ uri: receiverImage }}
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
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', padding: 5 }}>
                                                {item.urlType.map((url, urlIndex) => (
                                                    <View key={urlIndex}>
                                                        <Lightbox
                                                            activeProps={{
                                                                style: { flex: 1, resizeMode: 'contain', width: windowWidth, height: 400, }
                                                            }}
                                                        >
                                                            <Image
                                                                source={{ uri: url }}
                                                                style={{ width: 100, height: 100, borderRadius: 10, marginVertical: 5 }}
                                                            />
                                                        </Lightbox>

                                                    </View>

                                                ))}
                                                {/* <Text
                                                    style={[
                                                        {
                                                            fontSize: 12,
                                                            paddingHorizontal: 2,
                                                            paddingTop: 3
                                                        },
                                                        item.senderId === userId ? { textAlign: "right" } : { textAlign: "left" }
                                                    ]}
                                                >
                                                    {formatTime(item.createAt)}
                                                </Text> */}
                                            </View>
                                            <Pressable
                                                onPress={() => {
                                                    toggleReaction(item._id)
                                                }}
                                                style={[
                                                    { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.grey, justifyContent: 'center', alignItems: 'center' },
                                                    item?.senderId === userId ? { left: 5, bottom: -5 } : { right: 5, bottom: -5 }
                                                ]}>

                                                {Icons.Icons({
                                                    name: item?.reaction[0]?.type ? item?.reaction[0]?.type : 'iconTym',
                                                    width: 13,
                                                    height: 13
                                                })}
                                            </Pressable>

                                            {(showReactionIndex == item._id) && (
                                                <Reaction onSelectReaction={onSelectReaction} item={item} />
                                            )}

                                        </Pressable>
                                    </View>
                                )
                            }
                        })}
                    </ScrollView>
                </ImageBackground>
            </Pressable>
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
                    <Pressable
                        onPress={() => {
                            showIcon()
                        }}
                    >
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
            <Animated.View
                style={{
                    width: windowWidth,
                    height: showGif,
                    backgroundColor: Colors.black,
                    opacity: 1,
                }}
            >
                <ScrollView contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center'

                }}>
                    {arrgif.map((item, index) => (
                        <Pressable
                            key={index}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                source={{ uri: item.url }}
                                style={{ width: 80, height: 80 }}
                            />
                        </Pressable>
                    ))}
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
        // </KeyboardAvoidingView>
    );
}

const arrgif = [
    { id: 1, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(1).gif' },
    { id: 2, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(2).gif' },
    { id: 3, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(3).gif' },
    { id: 4, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(4).gif' },
    { id: 5, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(1).gif' },
    { id: 6, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(2).gif' },
    { id: 7, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(3).gif' },
    { id: 8, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(4).gif' },
    { id: 1, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(1).gif' },
    { id: 2, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(2).gif' },
    { id: 3, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(3).gif' },
    { id: 4, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(4).gif' },
    { id: 5, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(1).gif' },
    { id: 6, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(2).gif' },
    { id: 7, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(3).gif' },
    { id: 8, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(4).gif' },

]

export default ChatScreen;
