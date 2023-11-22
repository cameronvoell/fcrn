import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Text,
} from "react-native";
import * as XMTP from "@xmtp/react-native-sdk";
import { Eth } from "@fcrn/crypto";
import { APP_MNEMONIC } from "@env";

export const MessagesView = () => {
  const [client, setClient] = useState<XMTP.Client>(null);
  const [messages, setMessages] = useState<XMTP.DecodedMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [recipientAddress, setRecipientAddress] = useState(""); // The Ethereum address you want to message
  const [activeConversation, setActiveConversation] =
    useState<XMTP.Conversation>(null);

  const flatListRef = useRef<FlatList>();

  // Initialize XMTP client
  useEffect(() => {
    async function initXMTP() {
      const signer = new Eth.Address(APP_MNEMONIC); // Replace with your method to get the wallet signer
      const xmtpClient = await XMTP.Client.create(signer, {
        env: "production",
      });
      setClient(xmtpClient);
    }
    initXMTP();
  }, []);

  // Function to start a conversation and fetch messages
  const startConversation = async () => {
    if (client) {
      console.log("Starting conversation with", recipientAddress);
      const conversation =
        await client.conversations.newConversation(recipientAddress);
      setActiveConversation(conversation);
      conversation.streamMessages(async (message) => {
        const conversationMessages = await conversation.messages();
        messages.push(message);
        setMessages(conversationMessages);
      });
      const conversationMessages = await conversation.messages();
      setMessages(conversationMessages);
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    if (client && inputMessage) {
      await activeConversation.send(inputMessage);
      setInputMessage(""); // Clear input after sending
    }
  };

  const renderItem = ({ item }) => {
    const decodedMessage = item as XMTP.DecodedMessage;
    const senderAddress = decodedMessage.senderAddress;
    const shortAddress = `${senderAddress.substring(
      0,
      5,
    )}...${senderAddress.substring(senderAddress.length - 5)}`;

    return (
      <View style={styles.messageItem}>
        <Text>
          {shortAddress}: {decodedMessage.content.text}
        </Text>
      </View>
    );
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
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
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
  messageItem: {
    // ... styling for each message item
  },
});
