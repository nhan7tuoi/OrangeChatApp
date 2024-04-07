import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Reaction from './reaction';


const TextMessage = ({ item, formatTime, toggleReaction, index, userId, onSelectReaction, showReactionIndex, receiverImage }) => {
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
                        name: item?.reaction[0]?.type === '' ? 'iconTym' : item?.reaction[0]?.type,
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

export default TextMessage;
