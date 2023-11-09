import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { CastV2 } from "farcaster-api/neynar/feed-types";
import { useFetchFeed } from "../hooks/useFetchFeed";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const FeedView = () => {
  const { casts, refreshing, connectedFid, onRefresh, fetchCasts } =
    useFetchFeed();

  const toggleLike = async (castHash) => {
    // TODO: send like reaction to Hub
    console.log("Send like reaction to Hub for: " + castHash);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCasts();
    }, []),
  );

  const renderItem = ({ item }) => {
    const likeCount = item.reactions.likes.length;
    const isLiked = item.reactions.likes.some(
      (like) => String(like.fid) === connectedFid,
    );

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
          <Text style={styles.castTimestamp}>
            {new Date(item.timestamp).toLocaleString()}
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
        <View style={styles.castItemRow}>
          <TouchableOpacity
            onPress={() => toggleLike(item.hash)}
            style={styles.likeButton}
          >
            <FontAwesome
              name={isLiked ? "heart" : "heart-o"}
              color={isLiked ? "red" : "black"}
              size={20}
            />
            <Text style={styles.likeCount}>{likeCount}</Text>
          </TouchableOpacity>
        </View>
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
  likeButton: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 16,
    color: "#333",
  },
});
