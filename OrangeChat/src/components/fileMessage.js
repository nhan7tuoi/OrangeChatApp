import React from 'react';
import { View, Text,Pressable,Image } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Reaction from './reaction';


const FileMessage = ({item,index,userId,receiverImage,toggleReaction,downloadAndOpenFile,onSelectReaction,showReactionIndex}) => {
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
    );
}

export default FileMessage;
