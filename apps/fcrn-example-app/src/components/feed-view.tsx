import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { fetchHomeFeedByFid, fetchLoggedOutFeed } from "../api";
import { CastV2 } from "farcaster-api/neynar/feed-types";
import { StorageKeys } from "../constants/storageKeys";

export const FeedView = () => {
  const [casts, setCasts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCasts = async () => {
    const now = Date.now();
    const lastFetchString = await AsyncStorage.getItem(StorageKeys.LAST_FETCH);
    const lastFetchTime = lastFetchString ? parseInt(lastFetchString, 10) : 0;
    console.log("attempt refresh: " + now);
    if (now - lastFetchTime < 600000 && !refreshing) {
      return;
    }

    setRefreshing(true);
    console.log("refreshing true: " + now);
    const fid = await AsyncStorage.getItem(StorageKeys.CONNECTED_FID);

    try {
      let fetched_casts: CastV2[];
      if (fid) {
        fetched_casts = await fetchHomeFeedByFid(fid);
      } else {
        fetched_casts = await fetchLoggedOutFeed();
      }
      setCasts(fetched_casts);
      const nowString = Date.now().toString();
      await AsyncStorage.setItem(StorageKeys.LAST_FETCH, nowString);
    } catch (error) {
      console.error("Error fetching casts:", error);
    } finally {
      setRefreshing(false);
      const now2 = Date.now();
      console.log("refreshing false: " + (now2 - now));
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchCastsAndSetState = async () => {
        await fetchCasts();
      };
      fetchCastsAndSetState();
      return () => {};
    }, []),
  );

  const onRefresh = useCallback(async () => {
    await AsyncStorage.setItem(StorageKeys.LAST_FETCH, String(0));
    setRefreshing(true);
    fetchCasts();
  }, []);

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
