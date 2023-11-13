import React, { useCallback, useState, useEffect } from "react";
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
import { Hub } from "@fcrn/api";
import { useFetchFeed } from "../hooks/useFetchFeed";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { HUB_URL } from "@env";
import { getSecureValue } from "../utils/secureStorage";
import { StorageKeys } from "../constants/storageKeys";
import { signer } from "farcaster-crypto";
import { Neynar } from "@fcrn/api";

export const FeedView = () => {
  const { casts, refreshing, connectedFid, onRefresh, fetchCasts } =
    useFetchFeed();

  const [likeStatus, setLikeStatus] = useState({});

  const toggleLike = async (castHash, isLiked, authorFid, likeCount) => {
    setLikeStatus({
      ...likeStatus,
      [castHash]: {
        isLiked: !isLiked,
        likeCount: isLiked ? likeCount - 1 : likeCount + 1,
      },
    });
    console.log(HUB_URL);
    const hubApi = new Hub.API(HUB_URL);
    const signer_key_string = await getSecureValue(StorageKeys.SIGNING_KEY);
    const signer_key = signer.stringToUint8Array(signer_key_string);
    await hubApi.likeCast(
      authorFid,
      castHash,
      signer_key,
      isLiked,
      parseInt(connectedFid),
    );
  };

  useEffect(() => {
    if (casts.length === 0) {
      onRefresh();
    }
  }, [casts, onRefresh]);

  useFocusEffect(
    useCallback(() => {
      fetchCasts();
      setLikeStatus({});
    }, []),
  );

  const renderItem = ({ item }) => {
    const castV2 = item as Neynar.FeedTypes.CastV2;
    let likeCount = castV2.reactions.likes.length;
    let isLiked = castV2.reactions.likes.some(
      (like) => String(like.fid) === connectedFid,
    );

    // Override with local state if it exists
    if (likeStatus[castV2.hash]) {
      isLiked = likeStatus[castV2.hash].isLiked;
      likeCount = likeStatus[castV2.hash].likeCount;
    }

    const first10DigitsOfHash = castV2.hash.slice(0, 10);
    const warpcastUrl = `https://warpcast.com/${
      castV2.author.username || "unknownUser"
    }/${first10DigitsOfHash}`;
    return (
      <View style={styles.castItem}>
        <View style={styles.castItemRow}>
          <Text style={[styles.castText, styles.flex]}>
            {castV2.author.username}
          </Text>
          <Text style={styles.castTimestamp}>
            {new Date(castV2.timestamp).toLocaleString()}
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
          <Text style={styles.castText}>{castV2.text}</Text>
        </View>
        <View style={styles.castItemRow}>
          <TouchableOpacity
            onPress={() =>
              toggleLike(castV2.hash, isLiked, castV2.author.fid, likeCount)
            }
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
