
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
import Reaction from '../components/reaction';
import Lightbox from 'react-native-lightbox-v2';
import Video from 'react-native-video';






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
    const [showReactionIndex, setShowReactionIndex] = useState(-1);
    const [hasPerformedAction, setHasPerformedAction] = useState(false);


    // Hàm xử lý sự kiện cuộn của ScrollView
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


    ///reaction
    const toggleReaction = (index) => {
        if (showReactionIndex === index) {
            setShowReactionIndex(-1); // Nếu ô message đã hiển thị reaction thì ẩn reaction đi
        } else {
            setShowReactionIndex(index); // Nếu người dùng click vào ô message mới, cập nhật index của ô message và hiển thị reaction
        }
    };

    const onSelectReaction = (index, reaction) => {
        connectSocket.emit('reaction message', { messageId: index, userId: user._id, reactType: reaction, receiverId: receiverId });
        const newMessages = messages.map((message) => {
            if (message._id === index) {
                message.reaction = [{ type: reaction }];
            }
            return message;
        });
        setShowReactionIndex(-1);
    };
    //////////////////////////////////////////

    ///download file va mo file
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

    ///cuon xuong cuoi
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
    //////////////////////////////////////////


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

        setMessages(preMessage => [...preMessage, newMessage]);
        setInputMessage('');
        sendMessage(newMessage);
    };

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
                                isDeleted: false,
                                reaction: [],
                                isSeen: false,
                                isReceive: false,
                                isSend: false,
                            };
                            console.log(newMessage);
                            setMessages([...messages, newMessage]);
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
            setMessages([...messages, newMessage]);
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
    ///lay message lan dau
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

    //upadate message
    useEffect(() => {
        connectSocket.on('chat message', (msg) => {
            console.log('new message', msg);
            setMessages(preMessage => [...preMessage, msg]);
        });
        connectSocket.on('reaction message', (reaction) => {
            console.log('reaction message', reaction.messageId, reaction.reactType);
            const newMessages = messages.map((message) => {
                if (message._id === reaction.messageId) {
                    message.reaction = [{ type: reactType }];
                }
                console.log('mes' + message);
                return message;
            });

            // setMessages(newMessages);
        });
    }, []);

    // send message
    const sendMessage = (message) => {
        connectSocket.emit('chat message', message);
        getConversation();

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
            <Pressable style={{ flex: 8, backgroundColor: Colors.backgroundChat }} onPress={() => {
                hideIcon();
                setShowReactionIndex(-1);
            }}>
                {/* <ImageBackground source={require('../assets/image/anh2.jpg')} style={{ flex: 1 }} > */}
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
                            return (
                                <View key={index} style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
                                    <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Chào mừng bạn đến với OrangeC - Nơi gắn kết bạn bè online</Text>
                                </View>
                            )
                        }
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
                                                name: item?.reaction[0]?.type === '' ? item?.reaction[0]?.type : 'iconTym',
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
                                                name: item?.reaction[0]?.type === '' ? item?.reaction[0]?.type : 'iconTym',
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
                        if (item.type === "file") {
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
                                            <Pressable
                                                style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                                    {Icons.Icons({ name: 'iconFile', width: 24, height: 24 })}
                                                </View>
                                                <Pressable
                                                    onPress={() => {
                                                        downloadAndOpenFile(item.urlType[0]);
                                                    }}
                                                    style={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text numberOfLines={3} style={{ fontSize: 14, textDecorationLine: 'underline', color: Colors.white, fontWeight: 'bold' }}>{item.fileName}</Text>
                                                </Pressable>
                                            </Pressable>
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
                                                name: item?.reaction[0]?.type === '' ? item?.reaction[0]?.type : 'iconTym',
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
                        if (item.type === "video") {
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

                                            <Video
                                                source={{ uri: item.urlType[0] }}
                                                resizeMode="contain"
                                                controls={true}
                                                fullscreen={false}
                                                paused={false}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                }}
                                            >
                                            </Video>

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
                                                name: item?.reaction[0]?.type === '' ? item?.reaction[0]?.type : 'iconTym',
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
                {/* </ImageBackground> */}
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
