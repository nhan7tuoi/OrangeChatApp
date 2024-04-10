import React from 'react';
import { View, Pressable, Image, Dimensions, Text } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Lightbox from 'react-native-lightbox-v2';
import Reaction from './reaction';

const windowWidth = Dimensions.get('window').width;

const ImageMessage = ({ item, index, userId, receiverImage, toggleReaction, onSelectReaction, showReactionIndex, showPressOther, setItemSelected }) => {
    console.log(item);
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
                        borderRadius: 10,
                        margin: 10,
                        padding: 2,
                    }
                ]}>
                {item.isReCall === false ? (
                    <>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center', padding: 5 }}>
                            {item.urlType.map((url, urlIndex) => (
                                <View key={urlIndex}>
                                    <Lightbox
                                        onLongPress={() => {
                                            if (item.isReCall === false) {
                                                setItemSelected(item)
                                                if (item?.senderId === userId) {
                                                    showReCall(!isShowReCall)
                                                }
                                                showPressOther()
                                                console.log(item);
                                            }
                                        }}
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
                                name: (item?.reaction.length === 0 || item?.reaction[0]?.type === 'delete') ? 'iconTym' : item?.reaction[0]?.type,
                                width: 13,
                                height: 13
                            })}
                        </Pressable>

                        {(showReactionIndex == item._id) && (
                            <Reaction onSelectReaction={onSelectReaction} item={item} />
                        )}
                    </>
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

export default ImageMessage;
