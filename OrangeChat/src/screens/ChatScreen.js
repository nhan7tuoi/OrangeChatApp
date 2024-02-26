
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutogrowInput from 'react-native-autogrow-input'
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import { v4 as uuidv4 } from 'uuid';

const windowHeight = Dimensions.get('window').height;


const ChatScreen = ({ navigation }) => {


    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleInputText = (text) => {
        setInputMessage(text);
    };

    // Hàm gửi tin nhắn
    const onSend = () => {
        if (inputMessage.trim() === '') return; // Kiểm tra nếu tin nhắn rỗng thì không gửi
        const newMessage = {
            _id:  messages.length + 1, // Tạo ID mới cho tin nhắn
            text: inputMessage, // Tin nhắn từ thanh công cụ nhập liệu
            createdAt: new Date(), // Thời gian tạo tin nhắn
            user: { _id: 1 }, // Thông tin người gửi
            sent: true, // Trạng thái gửi tin nhắn
            received: true
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage])); // Thêm tin nhắn mới vào danh sách tin nhắn
        setInputMessage(''); // Xóa tin nhắn khỏi thanh công cụ nhập liệu sau khi gửi

        const newMessage2 = {
            _id: messages.length + 2, // Tạo ID mới cho tin nhắn
            text: inputMessage, // Tin nhắn từ thanh công cụ nhập liệu
            createdAt: new Date(), // Thời gian tạo tin nhắn
            user: { _id: 2, avatar: require('../assets/image/avt1.png') }, // Thông tin người gửi
            sent: true, // Trạng thái gửi tin nhắn
            received: true
        };

        if (!ws) {
            console.log('WebSocket connection not established');
            return;
        }
        console.log('Sending message', newMessage2);
        console.log('WebSocket connection state:', ws.readyState);
        ws.send(JSON.stringify(newMessage2));


    };
    const onSendTest = () => {
        if (inputMessage.trim() === '') return; // Kiểm tra nếu tin nhắn rỗng thì không gửi
        const newMessage = {
            _id: messages.length + 1, // Tạo ID mới cho tin nhắn
            text: inputMessage, // Tin nhắn từ thanh công cụ nhập liệu
            createdAt: new Date(), // Thời gian tạo tin nhắn
            user: { _id: 2, avatar: require('../assets/image/avt1.png') }, // Thông tin người gửi
            sent: true, // Trạng thái gửi tin nhắn
            received: true
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage])); // Thêm tin nhắn mới vào danh sách tin nhắn
        setInputMessage(''); // Xóa tin nhắn khỏi thanh công cụ nhập liệu sau khi gửi
    };

    // const requestCameraPermission = async () => {
    //     try {
    //       const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log("Camera permission given");
    //         //mở cam trước
    //         // const result = await launchCamera({mediaType:'photo',cameraType:'front'})
    //         //mở thư viện
    //         const result = await launchImageLibrary({mediaType:'mixed',selectionLimit:10})
    //       } else {
    //         console.log("Camera permission denied");
    //       }
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   };
    const onSelectImage = async () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 }, (response) => {
            if (!response.didCancel) {
                console.log(response);
                const newMessages = response.assets.map((asset, index) => ({
                    _id: messages.length + index + 1,
                    image: asset.uri,
                    createdAt: new Date(),
                    user: { _id: 1 },
                    sent: true,
                    received: true
                }));
                setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
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

    const handleBubblePress = (message) => {
        if (message.file) {
            // Mở tệp khi người dùng nhấn vào bóng chat
            openFile(message.uriFile, message.typeFile);
        }
    };
    const openFile = (uriFile, typeFile) => {
        // Thực hiện các thao tác mở tệp ở đây, ví dụ:
        // Mở một trình xem tệp hoặc trình duyệt web
        console.log('Mở tệp: ' + uriFile);
        console.log('Loại tệp: ' + typeFile);
    };

    //test
    // Hàm connect websocket
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const newWs = new WebSocket('ws://192.168.2.58:8080/chat');
        console.log('Connecting to WebSocket server');
        console.log('WebSocket connection state:', newWs.readyState);
        console.log('WebSocket connection state:', newWs.OPEN);

        newWs.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        setWs(newWs);

        return () => {
            newWs.close();
        };
    }, []);

    // Hàm gửi tin nhắn
    const sendMessageToServer = (message) => {
        if (!ws) {
            console.log('WebSocket connection not established');
            return;
        }
        console.log('Sending message', message);
        console.log('WebSocket connection state:', ws.readyState);
        ws.send(JSON.stringify(message));
    };

    // Hàm nhận tin nhắn
    useEffect(() => {
        if (!ws) return;

        ws.onmessage = (e) => {
            console.log('Received message', e.data);
            const newMessage = JSON.parse(e.data);
            setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
        };

        return () => {
            ws.onmessage = null;
        };
    }, [ws]);



    return (
        // <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat }}>
            {/* header */}
            <View style={{
                height: windowHeight * 0.1, flexDirection: 'row', backgroundColor: Colors.black,
                borderBottomWidth: 0.5,  // Thêm border bottom
                borderBottomColor: Colors.primary, // Màu của border bottom
                shadowColor: Colors.primary, // Màu của đổ bóng
                shadowOffset: { width: 1, height: 5 }, // Độ lệch của đổ bóng
                shadowOpacity: 0.8, // Độ mờ của đổ bóng
                shadowRadius: 10, // Bán kính của đổ bóng
                elevation: 5, // Độ nâng của đổ bóng (chỉ áp dụng cho Android)
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
                        onPress={onSendTest}
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
                    <GiftedChat
                        messages={messages}
                        renderAvatarOnTop={true}
                        user={{
                            _id: 1,
                        }}
                        renderInputToolbar={() => { return null }}
                        minInputToolbarHeight={0}
                        renderBubble={props => (
                            <View style={{ flexDirection: props.position === 'left' ? 'row' : 'row-reverse', alignItems: 'center' }}>
                                <Bubble
                                    {...props}
                                    onPress={() => handleBubblePress(props.currentMessage)}
                                    wrapperStyle={{
                                        left: {
                                            backgroundColor: props.currentMessage.sent ? Colors.primary : Colors.primary,
                                            maxWidth: '60%',
                                            padding: 2,
                                            marginBottom: 20
                                        },
                                        right: {
                                            backgroundColor: Colors.primary,
                                            maxWidth: '60%',
                                            padding: 2,
                                            marginBottom: 20
                                        },
                                    }}
                                    textStyle={{
                                        left: {
                                            color: Colors.white,
                                        },
                                        right: {
                                            color: Colors.white,
                                            color: props.currentMessage.file ? Colors.black : Colors.white,
                                            fontWeight: props.currentMessage.file ? 'bold' : 'normal'
                                        },
                                    }}
                                />
                                <View style={{ height: 10 }}></View>
                                {/* {props.currentMessage._id === 1 ? (
                                        <Pressable
                                            style={{ bottom: 0,position:'absolute',width:20,height:20,backgroundColor:Colors.white,borderRadius:10}}
                                            onPress={() => handleReaction(props.currentMessage._id, 'love')}>
                                            
                                        </Pressable>
                                    ) : (
                                        <Pressable
                                            style={{ bottom: 0,left:0,width:20,height:20,backgroundColor:Colors.red,borderRadius:10}}
                                            onPress={() => handleReaction(props.currentMessage._id, 'love')}>
                                            
                                        </Pressable>
                                    )} */}
                            </View>
                        )}
                    />
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
