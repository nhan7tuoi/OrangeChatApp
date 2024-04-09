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
        isDeleted: false,
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
        isDeleted: false,
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

// Update data từ Socket gửi về
useEffect(() => {
    connectSocket.on('chat message', (msg) => {

        if (msg.conversationApi === conversationId) {
            console.log('new message', msg);
            setMessages(preMessage => [...preMessage, msg]);
        }
    });
    connectSocket.on('reaction message', async (reaction) => {
        console.log('reaction message', reaction.messageId, reaction.reactType);
        if (reaction.conversationId === conversationId) {
            const newMessages = messages.map((message) => {
                if (message._id === reaction.messageId) {
                    message.reaction = [{ type: reaction.reactType }];
                }
                return message;
            });
            getLastMessage();
        }
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
}, []);