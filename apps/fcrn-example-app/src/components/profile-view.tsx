import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserDataByUsername } from "../api";
import { Signer } from "@fcrn/crypto";
import { getSecureValue } from "../utils/secureStorage";
import { StorageKeys } from "../constants/storageKeys";
import useWarpcastConnection from "../hooks/useWarpcastConnection";

interface Props {
  fid: string;
}

export const ProfileView = ({ fid }: Props) => {
  const [userData, setUserData] = useState(null);
  const [publicSigner, setPublicSigner] = useState("");

  const {
    connectedUserFid,
    warpcastConnected,
    isPolling,
    connectWithWarpcast,
    disconnectFromWarpcast,
  } = useWarpcastConnection();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = await AsyncStorage.getItem(StorageKeys.USERNAME);
      const storedFid = await AsyncStorage.getItem(StorageKeys.FID);

      if (storedUsername) {
        fetchData(storedUsername);
      } else if (fid || storedFid) {
        // Fetch by fid here, if needed
      }
    };

    fetchUserData();
  }, []);

  const fetchData = async (username: string) => {
    try {
      const privateKeyString = await getSecureValue(StorageKeys.SIGNING_KEY);
      const privateKey = Signer.stringToUint8Array(privateKeyString);
      const signerKey = new Signer.Key(privateKey);
      const publicKey = signerKey.getPublicKey();
      setPublicSigner(publicKey || "no connected user");
    } catch (error) {
      console.log("No connected user: ", error);
    }
    try {
      const user = await fetchUserDataByUsername(username);
      setUserData(user);
      AsyncStorage.setItem(StorageKeys.USERNAME, user.username);
      AsyncStorage.setItem(StorageKeys.FID, String(user.fid));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Image
            style={styles.profileImage}
            source={{ uri: userData.pfp.url }}
          />
          <Text style={styles.displayName}>{userData.displayName}</Text>
          <Text>Username: {userData.username}</Text>
          <Text>fid: {userData.fid}</Text>
          <Text>Address: {userData.custodyAddress}</Text>
          <Text>Follower Count: {userData.followerCount}</Text>
          <Text>Following Count: {userData.followingCount}</Text>
          <Text>Bio: {userData.profile.bio.text}</Text>
          <Text>Active Status: {userData.activeStatus}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={styles.container}>
        {warpcastConnected && (
          <>
            <Text>Your Warpcast account {connectedUserFid} is connected!</Text>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={disconnectFromWarpcast}
            >
              <Text style={styles.disconnectButtonText}>
                Disconnect from Warpcast
              </Text>
            </TouchableOpacity>
            <Text>connected-signer: {publicSigner}</Text>
          </>
        )}
        {!warpcastConnected && (
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={() => connectWithWarpcast()}
          >
            <Text style={styles.fetchButtonText}>Connect with Warpcast</Text>
          </TouchableOpacity>
        )}
        {isPolling && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Polling for Warpcast connection...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Your existing styles, possibly add one for the TextInput
const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  fetchButton: {
    backgroundColor: "#f2f2f2", // light gray background
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8, // rounded corners
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16, // padding from other items
  },
  fetchButtonText: {
    color: "#007AFF", // blue text
    fontSize: 16,
    textTransform: "none", // not all caps
  },
  disconnectButton: {
    // Add styles for your disconnect button here
    backgroundColor: "red",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  disconnectButtonText: {
    color: "white",
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
