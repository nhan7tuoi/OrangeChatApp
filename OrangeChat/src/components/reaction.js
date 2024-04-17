import React from 'react';
import { View, Pressable, } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import { useSelector } from 'react-redux';


const Reaction = ({ onSelectReaction, item }) => {
    const user = useSelector((state) => state.auth.user);
    return (
        <View style={user._id === item.senderId._id ?
            {
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: Colors.red,
                height: 50,
                width: 300,
                bottom: 30,
                position: 'absolute',
                borderRadius: 10,
                right: 50,
            } : {
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: Colors.red,
                height: 50,
                width: 300,
                bottom: 30,
                position: 'absolute',
                borderRadius: 10,
                left: 50,
            }
        }>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id, 'like')}>
                {Icons.Icons({ name: 'like', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id, 'love')}>
                {Icons.Icons({ name: 'love', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id, 'haha')}>
                {Icons.Icons({ name: 'haha', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id, 'wow')}>
                {Icons.Icons({ name: 'wow', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id, 'sad')}>
                {Icons.Icons({ name: 'sad', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id, 'angry')}>
                {Icons.Icons({ name: 'angry', width: "100%", height: "100%" })}
            </Pressable>
            <View style={{
                position: 'absolute',
                width: 40,
                height: 40,
                left:-40
            }}>
                <Pressable
                onPress={()=>{
                    onSelectReaction(item._id, 'delete')
                }}
                >
                    {Icons.Icons({ name: 'deleteReact', width: "100%", height: "100%" })}
                </Pressable>
            </View>
        </View>
    );
}

export default Reaction;
