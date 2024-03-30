import React from 'react';
import { View, Pressable, } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';


const Reaction = ({ onSelectReaction,item }) => {
    return (
        <View style={{
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
        }}>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id,'like')}>
                {Icons.Icons({ name: 'like', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id,'love')}>
                {Icons.Icons({ name: 'love', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id,'haha')}>
                {Icons.Icons({ name: 'haha', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id,'wow')}>
                {Icons.Icons({ name: 'wow', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id,'sad')}>
                {Icons.Icons({ name: 'sad', width: "100%", height: "100%" })}
            </Pressable>
            <Pressable style={{ width: 40, height: 40 }} onPress={() => onSelectReaction(item._id,'angry')}>
                {Icons.Icons({ name: 'angry', width: "100%", height: "100%" })}
            </Pressable>

        </View>
    );
}

export default Reaction;
