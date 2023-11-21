import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchChannelByName } from "../api";
import { StorageKeys } from "../constants/storageKeys";
import { ReplicatorApi } from "@fcrn/api";

export const useFetchFeed = () => {
  const [casts, setCasts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [connectedFid, setConnectedFid] = useState("");

  const fetchCasts = useCallback(
    async (selectedFeed) => {
      // const now = Date.now();
      // const lastFetchString = await AsyncStorage.getItem(
      //   StorageKeys.LAST_FETCH,
      // );
      // const lastFetchTime = lastFetchString ? parseInt(lastFetchString, 10) : 0;
      // if (now - lastFetchTime < 5 * 60 * 1000 && !refreshing) {
      //   return;
      // }

      setRefreshing(true);
      const fid = await AsyncStorage.getItem(StorageKeys.CONNECTED_FID);
      setConnectedFid(fid);

      try {
        let fetchedCasts: ReplicatorApi.Cast[];
        if (fid) {
          fetchedCasts = await fetchChannelByName(selectedFeed);
          console.log("Returned casts! " + fetchCasts.length);
        } else {
          fetchedCasts = await fetchChannelByName(selectedFeed);
        }
        setCasts(fetchedCasts);
        // await AsyncStorage.setItem(StorageKeys.LAST_FETCH, now.toString());
      } catch (error) {
        console.error("Error fetching casts:", error);
      } finally {
        setRefreshing(false);
      }
    },
    [refreshing],
  );

  const onRefresh = useCallback(
    async (selectedFeed: string) => {
      await AsyncStorage.setItem(StorageKeys.LAST_FETCH, "0");
      setRefreshing(true);
      fetchCasts(selectedFeed);
    },
    [fetchCasts],
  );

  return { casts, refreshing, connectedFid, onRefresh, fetchCasts };
};
