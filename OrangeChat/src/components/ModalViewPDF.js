import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Pdf from 'react-native-pdf';

const ModalViewPDF = ({ isVisible, fileUri, onClose }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', height: '80%' }}>
          <Pdf source={{ uri: fileUri }} style={{ flex: 1 }} />
          <Pressable onPress={onClose}>
            <Text style={{ marginTop: 10, color: 'blue', textAlign: 'center' }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalViewPDF;