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
import * as ed from "@noble/ed25519";
import { mnemonicToAccount } from "viem/accounts";
import "react-native-get-random-values";
import { sha512 } from "@noble/hashes/sha512";
import { APP_FID, APP_MNEMONIC } from "@env";
import { Warpcast } from "farcaster-api";

/*** EIP-712 helper code ***/

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

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
    ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
    ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));

    const privateKey = ed.utils.randomPrivateKey();
    const publicKeyBytes = ed.getPublicKey(privateKey);
    const publicKey = Buffer.from(publicKeyBytes).toString("hex");

    // Step 2 => Generate a Signed Key Request signature with "app FID"
    const account = mnemonicToAccount(APP_MNEMONIC);

    console.log("Mnemonic translated: " + account.address);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // signature is valid for 1 day
    const signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: "SignedKeyRequest",
      message: {
        requestFid: BigInt(APP_FID),
        key: `0x${publicKey}`,
        deadline: BigInt(deadline),
      },
    });

    // Step 3 => Call warpcast API to get deep link and polling token
    const signedKeyParams: Warpcast.SignedKeyRequestParams = {
      key: `0x${publicKey}`,
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
