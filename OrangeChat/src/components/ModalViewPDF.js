import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';

const ModalViewPDF = ({ isVisible, fileUri, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '90%', height: '90%', backgroundColor: 'white' }}>
          <Pressable onPress={onClose}>
            <Text style={{ textAlign: 'right', padding: 10 }}>Close</Text>
          </Pressable>
          <WebView
            source={{ uri: fileUri }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalViewPDF;