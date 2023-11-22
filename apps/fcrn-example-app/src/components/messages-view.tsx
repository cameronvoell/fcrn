import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Text,
} from "react-native";
import { Client } from "@xmtp/react-native-sdk";
import { Eth } from "@fcrn/crypto";
import { APP_MNEMONIC } from "@env";



export const MessagesView = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipientAddress, setRecipientAddress] = useState(""); // The Ethereum address you want to message
  // Initialize XMTP client
  useEffect(() => {
    async function initXMTP() {
      const signer = new Eth.Address(APP_MNEMONIC); // Replace with your method to get the wallet signer
      const xmtpClient = await Client.create(signer);
      setClient(xmtpClient);
    }

    initXMTP();
  }, []);

  // Function to start a conversation and fetch messages
  const startConversation = async () => {
    if (client) {
      const conversation =
        await client.conversations.newConversation(recipientAddress);
      const conversationMessages = await conversation.messages();
      setMessages(conversationMessages);
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    if (client && inputMessage) {
      const conversation =
        await client.conversations.newConversation(recipientAddress);
      await conversation.send(inputMessage);
      setInputMessage(""); // Clear input after sending
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipient Ethereum Address"
        value={recipientAddress}
        onChangeText={setRecipientAddress}
      />
      <Button title="Start Conversation" onPress={startConversation} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.content}</Text>}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
});
