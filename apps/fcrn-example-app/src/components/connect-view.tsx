import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Image,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserDataByUsername } from "../api";
import "react-native-get-random-values";
import { APP_FID, APP_MNEMONIC } from "@env";
import { Warpcast } from "farcaster-api";
import { signer, eth } from "farcaster-crypto";

export const ConnectView = () => {
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedFid = await AsyncStorage.getItem("fid");

      if (storedUsername) {
        setUsernameInput(storedUsername);
        fetchData(storedUsername);
        // } else if (fid || storedFid) {
        //   // Fetch by fid here, if needed
      }
    };
    fetchUserData();
  }, []);

  const connectWithWarpcast = async () => {
    // Step 1 => App generates a new ed25519 keypair
    const key = new signer.Key();

    // Step 2 => Generate a Signed Key Request signature with "app FID"
    const address = new eth.Address(APP_MNEMONIC);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // signature is valid for 1 day
    const signature = await address.signKeyRequest(
      APP_FID,
      `0x${key.getPublicKey()}`,
      deadline,
    );

    // Step 3 => Call warpcast API to get deep link and polling token
    const signedKeyParams: Warpcast.SignedKeyRequestParams = {
      key: `0x${key.getPublicKey()}`,
      signature,
      requestFid: APP_FID,
      deadline,
    };
    const signedKeyResponse = await new Warpcast.API().postSignedKeyRequest(
      signedKeyParams,
    );
    Linking.openURL(signedKeyResponse.deeplinkUrl);
  };

  const fetchData = async (username: string) => {
    try {
      const user = await fetchUserDataByUsername(username);
      setUserData(user);
      AsyncStorage.setItem("username", user.username);
      AsyncStorage.setItem("fid", String(user.fid));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 250 : 350}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {loggedIn ? (
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
          <Text> Your account will appear here after login </Text>
        )}
        <TouchableOpacity
          style={styles.fetchButton}
          onPress={() => connectWithWarpcast()}
        >
          <Text style={styles.fetchButtonText}>Connect with Warpcast</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
});
