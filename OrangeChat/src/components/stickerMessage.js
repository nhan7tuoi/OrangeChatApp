import React from 'react';
import { View, Image, Pressable, Text } from 'react-native';
import Colors from '../themes/Colors';

const StickerMessage = ({ item, index, setItemSelected, showPressOther, userId, receiverImage, showReCall, isShowReCall, conversation }) => {
    const getLastWord = (text) => {
        const words = text.split(' ');
        const last = words[words.length - 1];
        return last;
    }
    return (
        <View key={index} style={[
            item?.senderId._id === userId ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
            {
                flexDirection: 'row',
                paddingLeft: 10
            }
        ]}>
            {item?.senderId._id !== userId && (
                <View>
                    {conversation.isGroup === true && (
                        <Text
                            style={{
                                fontSize: 12,
                                paddingHorizontal: 2,
                                color: Colors.grey,
                                textAlign: 'center',

                            }}>
                            {getLastWord(item?.senderId.name)}
                        </Text>
                    )}
                    <Image
                        source={{ uri: receiverImage }}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                    />
                </View>
            )}
            <Pressable
                onLongPress={() => {
                    setItemSelected(item)
                    if (item?.senderId._id === userId) {
                        showReCall(!isShowReCall)
                    }
                    showPressOther()
                }}

                style={[
                    {
                        maxWidth: '60%',
                        padding: 2,
                        borderRadius: 10,
                        margin: 10,
                    }
                ]}
            >
                {item.isReCall === false ? (
                    <View>
                        <Image
                            source={{ uri: item.urlType[0] }}
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                ) : (
                    <Text style={{
                        fontSize: 14,
                        padding: 3,
                        color: Colors.white,
                        fontWeight: 600

                    }}>
                        Đã thu hồi
                    </Text>
                )}
            </Pressable>
        </View>
    );
}

export default StickerMessage;
