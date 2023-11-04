import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { fetchCastsByFid } from "../api"; // Adjust the path accordingly

export const FeedView = () => {
  const [casts, setCasts] = useState([]);
  const [username, setUsername] = useState(null);

  const fetchCasts = async () => {
    const [fid, fetchedUsername] = await Promise.all([
      AsyncStorage.getItem("fid"),
      AsyncStorage.getItem("username"), // Assuming username is stored under 'username'
    ]);

    setUsername(fetchedUsername);

    if (fid) {
      try {
        const casts = await fetchCastsByFid(fid);
        setCasts(casts);
      } catch (error) {
        console.error("Error fetching casts:", error);
      }
    }
  };

  useFocusEffect(() => {
    fetchCasts();
  });

  const renderItem = ({ item }) => {
    const first10DigitsOfHash = item.hash.slice(0, 10);
    const warpcastUrl = `https://warpcast.com/${
      username || "unknownUser"
    }/${first10DigitsOfHash}`;
    return (
      <View style={styles.castItem}>
        <View style={styles.castItemRow}>
          <Text style={styles.castText}>{item.text}</Text>
          <Text
            style={styles.warpcastLink}
            onPress={() => {
              Linking.openURL(warpcastUrl);
            }}
          >
            WC
          </Text>
        </View>
        <Text style={styles.castTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={casts}
      renderItem={renderItem}
      keyExtractor={(item) => item.hash}
    />
  );
};

const styles = StyleSheet.create({
  castItem: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  castItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  castText: {
    fontSize: 16,
  },
  warpcastLink: {
    fontSize: 16,
    color: "blue",
  },
  castTimestamp: {
    fontSize: 12,
    color: "#888",
  },
});
