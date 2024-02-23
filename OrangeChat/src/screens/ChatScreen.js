
import React, { useState} from 'react';
import { View, Text, KeyboardAvoidingView, Image, Pressable, Dimensions, ImageBackground,PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutogrowInput from 'react-native-autogrow-input'
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';

const windowHeight = Dimensions.get('window').height;


const ChatScreen = ({navigation}) => {


    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleInputText = (text) => {
        setInputMessage(text);
    };

    // Hàm gửi tin nhắn
    const onSend = () => {
        if (inputMessage.trim() === '') return; // Kiểm tra nếu tin nhắn rỗng thì không gửi
        const newMessage = {
            _id: messages.length + 1, // Tạo ID mới cho tin nhắn
            text: inputMessage, // Tin nhắn từ thanh công cụ nhập liệu
            createdAt: new Date(), // Thời gian tạo tin nhắn
            user: { _id: 1 }, // Thông tin người gửi
            sent: true, // Trạng thái gửi tin nhắn
            received: true
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage])); // Thêm tin nhắn mới vào danh sách tin nhắn
        setInputMessage(''); // Xóa tin nhắn khỏi thanh công cụ nhập liệu sau khi gửi

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
        launchImageLibrary({ mediaType: 'photo',selectionLimit:10 }, (response) => {
            if (!response.didCancel) {
                console.log(response);
                const source = response.assets[0].uri;
                console.log(source);
                const newMessage = {
                    _id: messages.length + 1,
                    image: source,
                    createdAt: new Date(),
                    user: { _id: 1 },
                    sent: true,
                    received: true
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
            }
        });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={50} style={{ flex: 1 }}>
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
                    <ImageBackground source={require('../assets/image/anh2.jpg')}  style={{ flex: 1 }}>
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
                                        wrapperStyle={{
                                            left: {
                                                backgroundColor: props.currentMessage.sent ? Colors.primary : Colors.primary,
                                                maxWidth: '60%',
                                            },
                                            right: {
                                                backgroundColor: Colors.primary,
                                                maxWidth: '60%',
                                            },
                                        }}
                                        textStyle={{
                                            left: {
                                                color: Colors.white,
                                            }
                                        }}
                                    />
                                </View>
                            )}
                        />
                    </ImageBackground>
                </View>
                {/* footer */}
                <View style={{ height: windowHeight * 0.1, flexDirection: 'row', backgroundColor: Colors.black }}>
                    <View style={{ width: '35%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingLeft: 20 }}>
                        <Pressable
                        onPress={()=>{
                            onSelectImage()
                        }}
                        >
                            {Icons.Icons({ name: 'iconImage', width: 22, height: 22 })}
                        </Pressable>
                        <Pressable>
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
                            onPress={onSend}
                            style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                            {Icons.Icons({ name: 'iconSend', width: 22, height: 22 })}
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default ChatScreen;
