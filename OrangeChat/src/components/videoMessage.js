import React from 'react';
import { View, Image,Pressable } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Reaction from './reaction';
import Video from 'react-native-video';

const VideoMessage = ({item,index,toggleReaction,onSelectReaction,showReactionIndex,userId,receiverImage}) => {
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

export default VideoMessage;
