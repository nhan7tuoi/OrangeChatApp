
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, Dimensions, ImageBackground, ScrollView, Keyboard, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutogrowInput from 'react-native-autogrow-input'
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import connectSocket from '../server/ConnectSocket';
import { useSelector, useDispatch } from 'react-redux';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { setConversations } from '../redux/conversationSlice';
import conversationApi from '../apis/conversationApi';
import messageApi from '../apis/messageApi';
import FirstMessage from '../components/firstMessage';
import TextMessage from '../components/textMessage';
import ImageMessage from '../components/imageMessage';
import FileMessage from '../components/fileMessage';
import VideoMessage from '../components/videoMessage';
import i18next from '../i18n/i18n';
import EmojiPicker, { vi } from 'rn-emoji-keyboard'
import StickerMessage from '../components/stickerMessage';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const ChatScreen = ({ navigation, route }) => {
    const selectedLanguage = useSelector((state) => state.language.selectedLanguage);
    const { receiverId, conversationId, receiverImage, receiverName } = route.params;
    const scrollViewRef = useRef(null);
    const user = useSelector((state) => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const dispatch = useDispatch();
    const userId = user._id;
    const showGif = useRef(new Animated.Value(0)).current;
    const showPress = useRef(new Animated.Value(0)).current;
    const [showReactionIndex, setShowReactionIndex] = useState(-1);
    const [hasPerformedAction, setHasPerformedAction] = useState(false);
    const [itemSelected, setItemSelected] = useState({});
    const [isOpenEmoji, setIsOpenEmoji] = useState(false);
    const [isShowReCall, setIsShowReCall] = useState(false);


    // Get Messages
    useEffect(() => {
        getLastMessage();
        console.log("fetch message");
    }, [])

    const getLastMessage = async () => {
        const response = await messageApi.getMessage({ conversationId: conversationId });
        if (response) {
            setMessages(response.data);
        }
    }

    // Get conversation
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

    // Format thời gian
    const formatTime = (time) => {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    //Cuộn xuống cuối
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollToBottom();
        }
    }, []);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current?.scrollToEnd({ animated: true })
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

    // Hàm xử lý sự kiện cuộn của ScrollView (bug chưa fix)
    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const distanceToEnd = contentOffset.y;

        // Kiểm tra nếu người dùng đã cuộn đến cuối danh sách, không có dữ liệu đang được tải và chưa thực hiện hành động
        if (distanceToEnd < 20 && !isLoading && !hasPerformedAction) {
            // Gửi yêu cầu tải thêm dữ liệu
            console.log('load more');
            loadMoreMessages();
            // Đặt biến trạng thái để chỉ ra rằng hành động đã được thực hiện
            setHasPerformedAction(true);
        }
    };
    const loadMoreMessages = async () => {
        try {
            setIsLoading(true);
            // Thực hiện yêu cầu tải thêm dữ liệu từ máy chủ
            const response = await messageApi.getMoreMessage({ conversationId: conversationId });
            if (response) {
                // Thêm tin nhắn mới vào cuối danh sách tin nhắn hiện tại
                setMessages(prevMessages => [...response.data, ...prevMessages]);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            // Cập nhật trạng thái isLoading sau khi nhận phản hồi từ máy chủ
            setIsLoading(false);
        }
    };
    useEffect(() => {
        // Reset biến trạng thái khi component mất khỏi màn hình
        return () => {
            setHasPerformedAction(false);
        };
    }, []);

    // Đóng mở emoji
    const handleEmoji = () => {
        setIsOpenEmoji(!isOpenEmoji);
    }

    // Open Sickers và Other
    const showIcon = () => {
        Animated.timing(showGif, {
            toValue: 300,
            duration: 100,
            useNativeDriver: false
        }).start(() => {
            scrollToBottom()
        });
    }
    const hideIcon = () => {
        console.log('hide');
        Animated.timing(showGif, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start();
    }
    const showPressOther = () => {
        Animated.timing(showPress, {
            toValue: 70,
            duration: 200,
            useNativeDriver: false
        }).start();
    }
    const hidePressOther = () => {
        Animated.timing(showPress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
        }).start();
    }

    //- show recall
    const showReCall = (isShowReCall) => {
        setIsShowReCall(isShowReCall);
    }

    // Xử lý tin nhắn gửi lên
    //- set tin nhắn
    const handleInputText = (text) => {
        setInputMessage(text);
    };
    //- gửi tin nhắn lên Socket
    const sendMessage = (message) => {
        connectSocket.emit('chat message', message);
        getConversation();

    };
    //- gửi tin nhắn TEXT
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
            deleteBy: [],
            reaction: [],
            isSeen: false,
            isReceive: false,
            isSend: false,
            isRecall: false,
        };
        setInputMessage('');
        sendMessage(newMessage);
    };
    // - gửi tin nhắn STICKER
    const onSendSticker = (url) => {
        const newMessage = {
            conversationId: conversationId,
            senderId: userId,
            receiverId: receiverId,
            type: "sticker",
            urlType: url,
            createAt: new Date(),
            deleteBy: [],
            reaction: [],
            isSeen: false,
            isReceive: false,
            isSend: false,
            isRecall: false,
        };
        sendMessage(newMessage);
    };
    // - gửi tin nhắn IMAGE + VIDEO
    const onSelectImage = async () => {
        launchImageLibrary({ mediaType: 'mixed', selectionLimit: 10 }, async (response) => {
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
                            const uploadResponse = await messageApi.uploadImage(formData);
                            const imageUrl = uploadResponse.data;
                            selectedImages.push(imageUrl);
                            console.log(uploadResponse.data);
                            const newMessage = {
                                conversationId: conversationId,
                                senderId: userId,
                                receiverId: receiverId,
                                type: image.type === 'video/mp4' ? 'video' : 'image',
                                urlType: selectedImages,
                                createAt: new Date(),
                                deleteBy: [],
                                reaction: [],
                                isSeen: false,
                                isReceive: false,
                                isSend: false,
                            };
                            console.log(newMessage);
                            sendMessage(newMessage);
                        } catch (error) {
                            console.error('Error uploading image:', error);
                        }
                    }));

                } catch (error) {
                    console.error('Error processing images:', error);
                }
            }
        });
    };
    // - gửi tin nhắn FILE
    const onSelectFile = async () => {
        try {
            const res = await DocumentPicker.pick();
            const formData = new FormData();
            formData.append('image', {
                uri: res[0].uri,
                type: res[0].type,
                name: res[0].name
            });
            console.log(formData.getAll('image'));
            const fileUrl = await messageApi.uploadFile(formData);
            const newMessage = {
                conversationId: conversationId,
                senderId: userId,
                receiverId: receiverId,
                type: "file",
                urlType: fileUrl.data,
                createAt: new Date(),
                isDeleted: false,
                reaction: [],
                isSeen: false,
                isReceive: false,
                isSend: false,
                typeFile: res[0].type,
                fileName: res[0].name
            };
            sendMessage(newMessage);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Hủy chọn tệp');
            }
            else {
                console.log('Lỗi khi chọn tệp: ' + err);
            }
        }
    };

    // Tải xuống và mở file
    const downloadAndOpenFile = async (fileUrl) => {
        try {
            const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            const options = {
                fromUrl: fileUrl,
                toFile: localFilePath,
            };

            const download = RNFS.downloadFile(options);
            download.promise.then(response => {
                if (response.statusCode === 200) {
                    // Mở tệp sau khi tải xuống hoàn tất
                    FileViewer.open(localFilePath, { showOpenWithDialog: true })
                        .then(() => console.log('File opened successfully'))
                        .catch(error => console.error('Error opening file:', error));
                } else {
                    Alert.alert('Download failed', `Failed to download ${fileName}`);
                }
            }).catch(error => console.error('Error downloading file:', error));
        } catch (error) {
            console.error('Error:', error);
        }
    };


    // Reaction message
    //- Lấy index message
    const toggleReaction = (index) => {
        if (showReactionIndex === index) {
            setShowReactionIndex(-1);
        } else {
            setShowReactionIndex(index);
        }
    };
    //- send reaction lên socket
    const onSelectReaction = (index, reaction) => {
        connectSocket.emit('reaction message', {
            messageId: index,
            userId: user._id,
            reactType: reaction,
            receiverId: receiverId,
            conversationId: conversationId
        });
        setShowReactionIndex(-1);
    };

    // Thu hồi tin nhắn
    const recallMessage = (messageId) => {
        console.log('recall message', itemSelected);
        hidePressOther()
        connectSocket.emit('recall message', { messageId: messageId, conversationId: conversationId });
        getConversation();
    };

    // Xóa tin nhắn
    const deleteMessage = (messageId) => {
        console.log('delete message', itemSelected);
        hidePressOther()
        connectSocket.emit('delete message', { messageId: messageId, conversationId: conversationId,userDelete: user._id});
        getConversation();
    };

    // Update data từ Socket gửi về
    useEffect(() => {
        connectSocket.on('chat message', (msg) => {
            if (msg.conversationId === conversationId) {
                console.log('new message', msg);
                setMessages(preMessage => [...preMessage, msg]);
            }
        });
        connectSocket.on('reaction message', async (reaction) => {
            console.log('reaction message', reaction.messageId, reaction.reactType);
            const newMessages = messages.map((message) => {
                if (message._id === reaction.messageId) {
                    message.reaction = [{ type: reaction.reactType }];
                }
                return message;
            });
            getLastMessage();
        });
        connectSocket.on('recall message', (msg) => {
            console.log('recall message', msg);
            if (msg.conversationId === conversationId) {
                const newMessages = messages.map((message) => {
                    if (message._id === msg.messageId) {
                        message.isRecall = true;
                    }
                    return message;
                });
                getLastMessage();
            }
        });
        connectSocket.on('delete message', (msg) => {
            console.log('delete message', msg);
            if (msg.conversationId === conversationId) {
                const newMessages = messages.map((message) => {
                    if (message._id === msg.messageId) {
                        message.deleteBy = [{ userDelete: msg.userDelete }];
                    }
                    return message;
                });
                getLastMessage();
            }
        });
    }, []);



    return (
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
                        <Image style={{ width: 54, height: 54, borderRadius: 26 }} source={{ uri: receiverImage }} />
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
                        onPress={() => {
                            handleEmoji()
                        }}
                        style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconCall', width: 22, height: 22 })}
                    </Pressable>
                    <Pressable style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconVideoCall', width: 22, height: 22 })}
                    </Pressable>
                    <Pressable
                        onLongPress={() => {
                            console.log("long press");
                        }}
                        style={{ width: '20%' }}>
                        {Icons.Icons({ name: 'iconOther', width: 22, height: 22 })}
                    </Pressable>
                </View>
            </View>
            {/* body */}
            <Pressable style={{ flex: 8, backgroundColor: Colors.backgroundChat }}
                onPress={() => {
                    hideIcon();
                    setShowReactionIndex(-1);
                    hidePressOther();
                    setIsShowReCall(false);
                    setItemSelected({});
                }}>
                <ImageBackground source={require('../assets/image/anh2.jpg')} style={{ flex: 1 }} >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
                        onContentSizeChange={handleContentSizeChange}
                    // onScroll={handleScroll}
                    // scrollEventThrottle={16}
                    >
                        {isLoading && <ActivityIndicator color={Colors.primary} size={32} />}

                        {messages.map((item, index) => {
                            if (item.type === "first") {
                                return (<FirstMessage item={item} key={index} />)
                            }
                            if (item.type === "text") {
                                return (<TextMessage
                                    key={index}
                                    item={item}
                                    formatTime={formatTime}
                                    toggleReaction={toggleReaction}
                                    userId={user._id}
                                    onSelectReaction={onSelectReaction}
                                    showReactionIndex={showReactionIndex}
                                    receiverImage={receiverImage}
                                    showPressOther={showPressOther}
                                    setItemSelected={setItemSelected}
                                    showReCall={showReCall}
                                    isShowReCall={isShowReCall}
                                />)
                            };

                            if (item.type === "image") {
                                return (<ImageMessage
                                    key={index}
                                    item={item}
                                    userId={userId}
                                    receiverImage={receiverImage}
                                    toggleReaction={toggleReaction}
                                    onSelectReaction={onSelectReaction}
                                    showReactionIndex={showReactionIndex}
                                    showPressOther={showPressOther}
                                    setItemSelected={setItemSelected}
                                    showReCall={showReCall}
                                    isShowReCall={isShowReCall}
                                />)
                            };
                            if (item.type === "file") {
                                return (<FileMessage
                                    key={index}
                                    item={item}
                                    userId={userId}
                                    receiverImage={receiverImage}
                                    toggleReaction={toggleReaction}
                                    downloadAndOpenFile={downloadAndOpenFile}
                                    onSelectReaction={onSelectReaction}
                                    showReactionIndex={showReactionIndex}
                                    showPressOther={showPressOther}
                                    setItemSelected={setItemSelected}
                                    showReCall={showReCall}
                                    isShowReCall={isShowReCall}
                                />)
                            };
                            if (item.type === "video") {
                                return (<VideoMessage
                                    key={index}
                                    item={item}
                                    userId={userId}
                                    receiverImage={receiverImage}
                                    toggleReaction={toggleReaction}
                                    onSelectReaction={onSelectReaction}
                                    showReactionIndex={showReactionIndex}
                                    showPressOther={showPressOther}
                                    setItemSelected={setItemSelected}
                                    showReCall={showReCall}
                                    isShowReCall={isShowReCall}
                                />)
                            };
                            if (item.type === "sticker") {
                                return (<StickerMessage
                                    key={index}
                                    item={item}
                                    userId={userId}
                                    receiverImage={receiverImage}
                                    showPressOther={showPressOther}
                                    setItemSelected={setItemSelected}
                                    showReCall={showReCall}
                                    isShowReCall={isShowReCall}
                                />)
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
                            color: Colors.black
                        }}
                        value={inputMessage}
                        onChangeText={handleInputText}
                    />
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
            {/* //sticker */}
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
                            onPress={() => {
                                onSendSticker(item.url)
                            }}
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
            {/* //other */}
            <Animated.View
                style={{
                    width: windowWidth,
                    height: showPress,
                    backgroundColor: 'gray',
                    position: 'absolute',
                    bottom: 0,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70 }}>
                    <Pressable style={{
                        width: '24%',
                        height: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.white
                    }}>
                        {Icons.Icons({ name: 'replyMsg', width: 22, height: 22 })}
                        <Text style={{
                            fontSize: 14,
                            color: Colors.black,
                            fontWeight: 'bold',
                            marginTop: 5
                        }}>{
                                i18next.t('traLoi')
                            }</Text>
                    </Pressable>
                    {isShowReCall && (
                        <Pressable
                            onPress={() => {
                                recallMessage(itemSelected._id)
                            }}
                            style={{
                                width: '25%',
                                height: 70,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: Colors.white
                            }}>
                            {Icons.Icons({ name: 'removeMsg', width: 22, height: 22 })}
                            <Text style={{
                                fontSize: 14,
                                color: Colors.black,
                                fontWeight: 'bold',
                                marginTop: 5
                            }}>
                                {i18next.t('thuHoi')}
                            </Text>
                        </Pressable>
                    )}
                    <Pressable
                        onPress={() => {
                            deleteMessage(itemSelected._id)
                        }}
                        style={{
                            width: '25%',
                            height: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.white
                        }}>
                        {Icons.Icons({ name: 'deleteMsg', width: 22, height: 22 })}
                        <Text style={{
                            fontSize: 14,
                            color: Colors.black,
                            fontWeight: 'bold',
                            marginTop: 5
                        }}>
                            {i18next.t('xoa')}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            navigation.navigate('ForwardMessage', { msg: itemSelected })
                        }}
                        style={{
                            width: '25%',
                            height: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: Colors.white
                        }}>
                        {Icons.Icons({ name: 'shareMsg', width: 22, height: 22 })}
                        <Text style={{
                            fontSize: 14,
                            color: Colors.black,
                            fontWeight: 'bold',
                            marginTop: 5
                        }}>
                            {i18next.t('chuyenTiep')}
                        </Text>
                    </Pressable>
                </View>
            </Animated.View>
            <EmojiPicker
                open={isOpenEmoji}
                onClose={() => handleEmoji()}
                onEmojiSelected={(emoji) => {
                    setInputMessage(inputMessage + emoji.emoji)
                }
                }
                theme={{
                    backdrop: '#16161888',
                    knob: '#766dfc',
                    container: '#282829',
                    header: '#fff',
                    skinTonesContainer: '#252427',
                    category: {
                        icon: '#766dfc',
                        iconActive: '#fff',
                        container: '#252427',
                        containerActive: '#766dfc',
                    },
                }}
                translation={vi}
            />
        </SafeAreaView>
    );
}

const arrgif = [
    { id: 1, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(1).gif' },
    { id: 2, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(2).gif' },
    { id: 3, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(3).gif' },
    { id: 4, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/icongif+(4).gif' },
    { id: 5, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(1).jpg' },
    { id: 6, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(2).png' },
    { id: 7, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(3).png' },
    { id: 8, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(4).png' },
    { id: 9, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(5).png' },
    { id: 10, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(6).png' },
    { id: 11, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(7).png' },
    { id: 12, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(8).png' },
    { id: 13, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(9).png' },
    { id: 14, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(10).png' },
    { id: 15, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(11).png' },
    { id: 16, url: 'https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/sticker+(12).png' },

]

export default ChatScreen;
