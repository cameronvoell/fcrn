import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserDataByUsername } from '../api';


interface Props {
  fid: string;
}

export const ProfileView = ({ fid }: Props) => {
  const [userData, setUserData] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedFid = await AsyncStorage.getItem("fid");

      if (storedUsername) {
        setUsernameInput(storedUsername);
        fetchData(storedUsername);
      } else if (fid || storedFid) {
        // Fetch by fid here, if needed
      }
    };

    fetchUserData();
  }, []);

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
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
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
      <TextInput
        style={styles.input}
        value={usernameInput}
        onChangeText={setUsernameInput}
        placeholder="Enter username"
      />
      <TouchableOpacity style={styles.fetchButton} onPress={() => fetchData(usernameInput)}>
        <Text style={styles.fetchButtonText}>Fetch Profile</Text>
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
    backgroundColor: '#f2f2f2', // light gray background
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8, // rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16, // padding from other items
  },
  fetchButtonText: {
    color: '#007AFF', // blue text
    fontSize: 16,
    textTransform: 'none', // not all caps
  },
});