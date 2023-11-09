import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { CastV2 } from "farcaster-api/neynar/feed-types";
import { useFetchFeed } from "../hooks/useFetchFeed";

export const FeedView = () => {
  const { casts, refreshing, onRefresh, fetchCasts } = useFetchFeed();

  useFocusEffect(
    useCallback(() => {
      fetchCasts();
    }, []),
  );

  const renderItem = ({ item }) => {
    const first10DigitsOfHash = item.hash.slice(0, 10);
    const warpcastUrl = `https://warpcast.com/${
      item.author.username || "unknownUser"
    }/${first10DigitsOfHash}`;
    return (
      <View style={styles.castItem}>
        <View style={styles.castItemRow}>
          <Text style={[styles.castText, styles.flex]}>
            {item.author.username}
          </Text>
          <View style={styles.warpcastLinkContainer}>
            <Text
              style={styles.warpcastLink}
              onPress={() => {
                Linking.openURL(warpcastUrl);
              }}
            >
              WC
            </Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.castText}>{item.text}</Text>
        </View>
        <Text style={styles.castTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={casts as CastV2[]}
      renderItem={renderItem}
      keyExtractor={(item) => item.hash}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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
  castTimestamp: {
    fontSize: 12,
    color: "#888",
  },
  flex: {
    flex: 1,
  },
  warpcastLinkContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  textContainer: {
    width: "90%",
  },
  warpcastLink: {
    fontSize: 16,
    color: "blue",
  },
});
