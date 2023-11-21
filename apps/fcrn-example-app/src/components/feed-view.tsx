import React, { useCallback, useState } from "react";
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
import { Signer } from "@fcrn/crypto";
import { ReplicatorApi } from "@fcrn/api";

export const FeedView = () => {
  const [selectedFeed, setSelectedFeed] = useState("farcaster"); // Default feed
  const { casts, refreshing, connectedFid, onRefresh, fetchCasts } =
    useFetchFeed();

  const [likeStatus, setLikeStatus] = useState({});

  const ChannelButton = ({ text }) => {
    const handlePress = () => {
      setSelectedFeed(text);
      fetchCasts(text);
    };
    return (
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const ButtonRow = () => {
    const buttons = ["farcaster", "dev", "memes", "food", "Following"];

    return (
      <View style={styles.row}>
        {buttons.map((buttonText, index) => (
          <ChannelButton key={index} text={buttonText} />
        ))}
      </View>
    );
  };

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
    const signer_key = Signer.stringToUint8Array(signer_key_string);
    await hubApi.likeCast(
      authorFid,
      castHash,
      signer_key,
      isLiked,
      parseInt(connectedFid),
    );
  };

  useFocusEffect(
    useCallback(() => {
      // Reset like status when the component comes into focus
      setLikeStatus({});
    }, []),
  );

  const renderItem = ({ item }) => {
    const castV2 = item as ReplicatorApi.Cast;
    let likeCount = castV2.reactions.length;
    let isLiked = castV2.reactions.some(
      (reaction) => String(reaction.reaction_fid) === connectedFid,
    );

    // Override with local state if it exists
    if (likeStatus[castV2.cast_hash]) {
      isLiked = likeStatus[castV2.cast_hash].isLiked;
      likeCount = likeStatus[castV2.cast_hash].likeCount;
    }

    const first10DigitsOfHash = "0" + castV2.cast_hash.slice(1, 10);
    const warpcastUrl = `https://warpcast.com/${
      castV2.username || "unknownUser"
    }/${first10DigitsOfHash}`;
    return (
      <View style={styles.castItem}>
        <View style={styles.castItemRow}>
          <Text style={[styles.castText, styles.flex]}>{castV2.username}</Text>
          <Text style={styles.castTimestamp}>
            {new Date(castV2.cast_timestamp).toLocaleString()}
          </Text>
          <View style={styles.warpcastLinkContainer}>
            <Text
              style={styles.warpcastLink}
              onPress={() => {
                console.log(warpcastUrl);
                Linking.openURL(warpcastUrl);
              }}
            >
              WC
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.castText}>{castV2.cast_text}</Text>
        </View>
        <View style={styles.castItemRow}>
          <TouchableOpacity
            onPress={() =>
              toggleLike(castV2.cast_hash, isLiked, castV2.cast_fid, likeCount)
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
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <ButtonRow />
      </View>
      <FlatList
        style={styles.flatlist}
        data={casts as ReplicatorApi.Cast[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.hash}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh(selectedFeed)}
          />
        }
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 0,
    marginLeft: 0,
  },
  buttonContainer: {
    // Adjust the flex value as needed
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
    paddingTop: 18,
    paddingLeft: 10,
  },
  flatlist: {
    paddingTop: 0,
    paddingLeft: 0,
    marginLeft: 0,
  },
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 75,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#007bff",
    margin: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
