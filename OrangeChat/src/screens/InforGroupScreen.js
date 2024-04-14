import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const InforGroupScreen = ({route}) => {
  const conversation = route?.params;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundChat}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Pressable>
          <Image
            source={{uri: conversation.image}}
            style={{width: 100, height: 100}}
          />
          <View>{Icons.Icons({name: 'edit', width: 30, height: 30})}</View>
        </Pressable>
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text>{conversation.nameGroup}</Text>
          {Icons.Icons({name: 'edit', width: 30, height: 30})}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default InforGroupScreen;

const styles = StyleSheet.create({});
