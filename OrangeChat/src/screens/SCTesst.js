import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, Pressable } from "react-native";
import connectSocket from "../server/ConnectSocket";


const SCTest = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    connectSocket.initSocket();
  }, []);

  return (
    <View>
      {/* Hiển thị danh sách tin nhắn */}
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* Ô nhập tin nhắn */}
      <TextInput
      style={{borderWidth:1}}
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Type your message..."
      />
    <Pressable onPress={()=>{
    }}>
      <Text>Send</Text>
    </Pressable>
    </View>
  );
}

export default SCTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});