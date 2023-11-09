import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchHomeFeedByFid, fetchLoggedOutFeed } from "../api";
import { StorageKeys } from "../constants/storageKeys";
import { CastV2 } from "farcaster-api/neynar/feed-types";

export const useFetchFeed = () => {
  const [casts, setCasts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [connectedFid, setConnectedFid] = useState("");

  const fetchCasts = useCallback(async () => {
    const now = Date.now();
    const lastFetchString = await AsyncStorage.getItem(StorageKeys.LAST_FETCH);
    const lastFetchTime = lastFetchString ? parseInt(lastFetchString, 10) : 0;
    if (now - lastFetchTime < 5 * 60 * 1000 && !refreshing) {
      return;
    }

    setRefreshing(true);
    const fid = await AsyncStorage.getItem(StorageKeys.CONNECTED_FID);
    setConnectedFid(fid);

    try {
      let fetchedCasts: CastV2[];
      if (fid) {
        fetchedCasts = await fetchHomeFeedByFid(fid);
      } else {
        fetchedCasts = await fetchLoggedOutFeed();
      }
      setCasts(fetchedCasts);
      await AsyncStorage.setItem(StorageKeys.LAST_FETCH, now.toString());
    } catch (error) {
      console.error("Error fetching casts:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  const onRefresh = useCallback(async () => {
    await AsyncStorage.setItem(StorageKeys.LAST_FETCH, "0");
    setRefreshing(true);
    fetchCasts();
  }, [fetchCasts]);

  return { casts, refreshing, connectedFid, onRefresh, fetchCasts };
};
