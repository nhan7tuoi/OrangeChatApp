import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Colors from '../themes/Colors';
import Icons from '../themes/Icons';
import Reaction from './reaction';

const TextMessage = ({
  item,
  formatTime,
  toggleReaction,
  index,
  userId,
  onSelectReaction,
  showReactionIndex,
  receiverImage,
  showPressOther,
  setItemSelected,
  showReCall,
  isShowReCall,
  conversation
}) => {

  const getLastWord = (text) => {
    const words = text.split(' ');
    const last = words[words.length - 1];
    return last;
  };
  return (
    <View
      key={index}
      style={[
        item?.senderId._id === userId
          ? { alignSelf: 'flex-end' }
          : { alignSelf: 'flex-start' },
        {
          flexDirection: 'row',
          paddingLeft: 10,
        },
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
          if (item.isReCall === false) {
            setItemSelected(item);
            if (item?.senderId._id === userId) {
              showReCall(!isShowReCall);
            }
            showPressOther();
            console.log(item);
          }
        }}
        style={[
          {
            backgroundColor: Colors.bubble,
            maxWidth: '60%',
            padding: 2,
            borderRadius: 10,
            margin: 10,
            minWidth: '20%',
          },
        ]}>
        <Text
          style={{
            fontSize: 14,
            padding: 3,
            color: Colors.white,
            fontWeight: 600,
          }}>
          {item.isReCall === true ? 'Đã thu hồi' : item.contentMessage}
        </Text>
        {item.isReCall === false && (
          <>
            <Text
              style={[
                {
                  fontSize: 12,
                  paddingHorizontal: 2,
                },
                item?.senderId._id === userId
                  ? { textAlign: 'right' }
                  : { textAlign: 'left' },
              ]}>
              {formatTime(item.createAt)}
            </Text>
            <Pressable
              onPress={() => {
                toggleReaction(item._id);
              }}
              style={[
                {
                  position: 'absolute',
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: Colors.grey,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                item?.senderId._id === userId
                  ? { left: 5, bottom: -5 }
                  : { right: 5, bottom: -5 },
              ]}>
              {Icons.Icons({
                name:
                  item?.reaction.length === 0 ||
                    item?.reaction[0]?.type === 'delete'
                    ? 'iconTym'
                    : item?.reaction[0]?.type,
                width: 13,
                height: 13,
              })}
            </Pressable>

            {showReactionIndex == item._id && (
              <Reaction onSelectReaction={onSelectReaction} item={item} />
            )}
          </>
        )}
      </Pressable>
    </View>
  );
};

export default TextMessage;
