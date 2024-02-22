
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Image, Pressable, Dimensions, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import AutogrowInput from 'react-native-autogrow-input'
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Colors from '../themes/Colors';

const windowHeight = Dimensions.get('window').height;


const ChatScreen = () => {


    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [firstMessageSent, setFirstMessageSent] = useState(false);

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
            send: true // Trạng thái gửi tin nhắn
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage])); // Thêm tin nhắn mới vào danh sách tin nhắn
        setInputMessage(''); // Xóa tin nhắn khỏi thanh công cụ nhập liệu sau khi gửi

        setFirstMessageSent(false);
    };
    const onSendTest = () => {
        if (inputMessage.trim() === '') return; // Kiểm tra nếu tin nhắn rỗng thì không gửi
        const newMessage = {
            _id: messages.length + 1, // Tạo ID mới cho tin nhắn
            text: inputMessage, // Tin nhắn từ thanh công cụ nhập liệu
            createdAt: new Date(), // Thời gian tạo tin nhắn
            user: { _id: 2 }, // Thông tin người gửi
            sent: true // Trạng thái gửi tin nhắn
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage])); // Thêm tin nhắn mới vào danh sách tin nhắn
        setInputMessage(''); // Xóa tin nhắn khỏi thanh công cụ nhập liệu sau khi gửi
    };

    useEffect(() => {
        // Nếu có tin nhắn từ phía người dùng thì đánh dấu rằng đã gửi tin nhắn
        const hasUserSentMessage = messages.some(message => message.user._id === 2);
        if (hasUserSentMessage) {
            setFirstMessageSent(true);
        }
    }, [messages]);


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={70} style={{ flex: 1 }}>
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
                            style={{
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image style={{ width: 16, height: 24 }} source={require('../assets/icon/VectoriconBack.png')} />
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
                            <Image source={require('../assets/icon/VectoriconCall.png')} />
                        </Pressable>
                        <Pressable style={{ width: '20%' }}>
                            <Image source={require('../assets/icon/VectoriconVideoCall.png')} />
                        </Pressable>
                        <Pressable style={{ width: '20%' }}>
                            <Image source={require('../assets/icon/VectoriconOther.png')} />
                        </Pressable>
                    </View>
                </View>
                {/* body */}
                <View style={{ flex: 8, backgroundColor: Colors.backgroundChat }}>
                    <ImageBackground source={require('../assets/image/anh2.jpg')} resizeMode='contain' style={{ flex: 1 }}>
                        <GiftedChat
                            messages={messages}
                            user={{
                                _id: 1,
                            }}
                            renderInputToolbar={() => { return null }}
                            minInputToolbarHeight={0}
                            renderBubble={props => (
                                <View style={{ flexDirection: props.position === 'left' ? 'row' : 'row-reverse', alignItems: 'center' }}>
                                    {props.position === 'left' && (firstMessageSent || props.currentMessage.sent) && (
                                        <View style={{ marginLeft: -30, paddingRight: 15 }}>
                                            <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={require('../assets/image/avt1.png')} />
                                        </View>
                                    )}
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
                        <Pressable>
                            <Image source={require('../assets/icon/VectoriconImage.png')} />
                        </Pressable>
                        <Pressable>
                            <Image source={require('../assets/icon/VectoriconFile.png')} />
                        </Pressable>
                        <Pressable>
                            <Image source={require('../assets/icon/VectoriconIcon.png')} />
                        </Pressable>
                    </View>
                    <View style={{ width: '55%', justifyContent: 'center', alignItems: 'center' }}>
                        <AutogrowInput
                            maxHeight={50}
                            minHeight={40}
                            placeholder={'Aa'}
                            defaultHeight={50} style={{
                                backgroundColor: Colors.white,
                                height: 10,
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
                            <Image source={require('../assets/icon/VectoriconSend.png')} />
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

export default ChatScreen;
