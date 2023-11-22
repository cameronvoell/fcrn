import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  RefreshControl,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "expo-router";
import { Hub } from "@fcrn/api";
import { useFetchFeed } from "../hooks/useFetchFeed";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { HUB_URL } from "@env";
import { getSecureValue } from "../utils/secureStorage";
import { StorageKeys } from "../constants/storageKeys";
import { Signer } from "@fcrn/crypto";
import { ReplicatorApi } from "@fcrn/api";

const isImage = (url) => {
  return /\.(gif|png|jpg)$/i.test(url);
};

// Utility function to escape special characters in the URL for regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const FeedView = () => {
  const [selectedFeed, setSelectedFeed] = useState("farcaster"); // Default feed
  const { casts, refreshing, connectedFid, onRefresh, fetchCasts } =
    useFetchFeed();
  const [likeStatus, setLikeStatus] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalOptions, setModalOptions] = useState([]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [buttonsText, setButtonsText] = useState([
    "farcaster",
    "memes",
    "dev",
    "food",
    "ai",
    "fitness",
    "ethereum",
    "art",
    "purple",
    "nouns",
  ]);

  useEffect(() => {
    // Fetch options for modal from ReplicatorAPI
    async function fetchModalOptions() {
      const options = Object.keys(ReplicatorApi.ChannelMapping).sort(); // Replace with actual API call
      setModalOptions(options);
    }

    fetchModalOptions();
  }, []);

  const handleLongPress = (index) => {
    setSelectedButtonIndex(index);
    setModalVisible(true);
  };

  const handleOptionSelect = (option) => {
    const updatedButtons = [...buttonsText];
    updatedButtons[selectedButtonIndex] = option;
    console.log("Updated buttons: " + updatedButtons);
    setButtonsText(updatedButtons);
    setModalVisible(false);
    // Update the selected feed and refresh the casts
    setSelectedFeed(option);
    fetchCasts(option);
  };

  const ChannelButton = ({ index, text }) => {
    const handlePress = () => {
      setSelectedFeed(text);
      fetchCasts(text);
    };
    const isSelected = text === selectedFeed;
    return (
      <TouchableOpacity
        style={[styles.button, isSelected ? styles.selectedButton : null]}
        onPress={handlePress}
        onLongPress={() => handleLongPress(index)}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const ButtonRow = ({ buttons }) => {
    return (
      <View style={styles.row}>
        {buttons.map((buttonText, index) => (
          <ChannelButton key={index} text={buttonText} index={index} />
        ))}
      </View>
    );
  };

  const ModalComponent = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <FlatList
                data={modalOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleOptionSelect(item)}>
                    <Text style={styles.modalText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
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

  useEffect(() => {
    fetchCasts(selectedFeed); // Fetch data when the component mounts
  }, []);

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
    if (castV2.cast_embeds && castV2.cast_embeds.length > 0) {
      const urlRegex = new RegExp(escapeRegExp(castV2.cast_embeds[0].url), "g");
      const updatedText = castV2.cast_text.replace(urlRegex, "");
      castV2.cast_text = updatedText;
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
        {castV2.cast_embeds && castV2.cast_embeds.length > 0 && (
          <View>
            {isImage(castV2.cast_embeds[0].url) ? (
              <Image
                source={{ uri: castV2.cast_embeds[0].url }}
                style={{ width: "100%", height: 400 }}
                resizeMode="contain"
              />
            ) : (
              <View style={{ width: "100%", height: 300, flex: 1 }}>
                <WebView
                  source={{
                    uri: castV2.cast_embeds[0].url,
                  }}
                  style={{ width: "100%", height: 300 }}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "transparent",
                  }}
                  onPress={() => Linking.openURL(castV2.cast_embeds[0].url)}
                />
              </View>
            )}
          </View>
        )}
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
      <ModalComponent />
      <View style={styles.buttonContainer}>
        <ButtonRow buttons={buttonsText} />
      </View>
      <FlatList
        style={styles.flatlist}
        data={casts as ReplicatorApi.Cast[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.cast_hash}
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
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 5,
    paddingTop: 5,
    paddingHorizontal: 5,
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
    height: 30,
    borderRadius: 20,
    backgroundColor: "#007bff",
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginVertical: 5,
    minWidth: 40,
  },
  selectedButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginVertical: 5,
    backgroundColor: "#ff69b4", // pinkish color for selected button
    minWidth: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap", // Allow wrapping of buttons
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
