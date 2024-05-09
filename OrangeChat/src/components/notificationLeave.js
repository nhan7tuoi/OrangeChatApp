import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import i18next from 'i18next';
import Colors from '../themes/Colors';

const NotificationLeave = (props) => {
  return (
    <View
      key={props.key}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
      }}>
      <Text
        style={{
          color: Colors.white,
          fontSize: 16,
          textAlign: 'center',
        }}>
        {props.item.senderId.name} {i18next.t('thongBaoRoi')}
      </Text>
    </View>
  );
}

export default NotificationLeave

const styles = StyleSheet.create({})