import React from 'react';
import { View, Image, Pressable } from 'react-native';

const StickerMessage = ({ item, index, setItemSelected, showPressOther, userId, receiverImage,showReCall,isShowReCall }) => {
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
                onLongPress={() => {
                    setItemSelected(item)
                    if (item?.senderId === userId) {
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
