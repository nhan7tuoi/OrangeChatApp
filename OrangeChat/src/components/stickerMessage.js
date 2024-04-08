import React from 'react';
import { View, Image,Pressable } from 'react-native';

const StickerMessage = ({item,index,setItemSelected,showPressOther,userId,receiverImage}) => {
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
            <View>
                <Image
                source={{ uri: item.urlType[0] }}
                style={{ width: 200, height: 200 }}
                />
            </View>
        </Pressable>
    </View>
  );
}

export default StickerMessage;
