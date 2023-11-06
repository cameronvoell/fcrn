import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import "react-native-get-random-values";
import useWarpcastConnection from "../hooks/useWarpcastConnection";

export const ConnectView = () => {
  const {
    connectedUserFid,
    warpcastConnected,
    isPolling,
    connectWithWarpcast,
    disconnectFromWarpcast,
  } = useWarpcastConnection();

  return (
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
  );
};

// Your existing styles, possibly add one for the TextInput
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
});
