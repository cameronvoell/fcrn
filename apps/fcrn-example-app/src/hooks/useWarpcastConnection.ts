import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Linking } from "react-native";
import { Warpcast } from "@fcrn/api";
import { Signer, Eth } from "@fcrn/crypto";
import { APP_FID, APP_MNEMONIC } from "@env";
import {
  getSecureValue,
  saveSecureValue,
  removeSecureValue,
} from "../utils/secureStorage";
import { StorageKeys } from "../constants/storageKeys";

interface UseWarpcastConnection {
  connectedUserFid: string;
  warpcastConnected: boolean;
  isPolling: boolean;
  connectWithWarpcast: () => Promise<void>;
  disconnectFromWarpcast: () => Promise<void>;
}

export default function useWarpcastConnection(): UseWarpcastConnection {
  const [connectedUserFid, setConnectedUserFid] = useState<string>("");
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [warpcastConnected, setWarpcastConnected] = useState<boolean>(false);
  const [pollingToken, setPollingToken] = useState<string | null>(null);

  const checkConnectionStatus = useCallback(async () => {
    const isConnected = await AsyncStorage.getItem(StorageKeys.IS_CONNECTED);
    if (isConnected === "true") {
      const userFid = await AsyncStorage.getItem(StorageKeys.CONNECTED_FID);
      setWarpcastConnected(true);
      setConnectedUserFid(userFid || "");
    }
  }, []);

  useEffect(() => {
    checkConnectionStatus();
  }, [checkConnectionStatus]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === "active" && pollingToken) {
        setIsPolling(true);
        await poll(pollingToken);
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription?.remove();
    };
  }, [pollingToken]);

  const poll = async (token: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 10;
    while (true) {
      if (attempts >= maxAttempts) {
        console.log("Max polling attempts reached.");
        break;
      }
      let signedKeyRequestResult: Warpcast.SignedKeyRequestResult = null;
      try {
        signedKeyRequestResult = await new Warpcast.API().pollForSigner(token);
      } catch (error) {
        console.log("Error polling for signer: " + error);
      }
      console.log("polling signed key request: " + token);
      if (
        signedKeyRequestResult != null &&
        signedKeyRequestResult.state === "completed"
      ) {
        console.log("Poll result: " + JSON.stringify(signedKeyRequestResult));
        setWarpcastConnected(true);
        setIsPolling(false);
        const pendingKey = await getSecureValue(StorageKeys.PENDING_KEY);
        saveSecureValue(StorageKeys.SIGNING_KEY, pendingKey);
        removeSecureValue(StorageKeys.PENDING_KEY);
        setConnectedUserFid(String(signedKeyRequestResult.userFid));
        await AsyncStorage.setItem(
          StorageKeys.CONNECTED_FID,
          String(signedKeyRequestResult.userFid),
        );
        await AsyncStorage.setItem(StorageKeys.IS_CONNECTED, "true");
        break;
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    setIsPolling(false);
  };

  const disconnectFromWarpcast = useCallback(async () => {
    setIsPolling(false);
    setPollingToken(null);
    setWarpcastConnected(false);
    await AsyncStorage.setItem(StorageKeys.IS_CONNECTED, "false");
    await AsyncStorage.removeItem(StorageKeys.CONNECTED_FID);
    removeSecureValue(StorageKeys.SIGNING_KEY);
  }, []);

  const connectWithWarpcast = async () => {
    // Step 1 => App generates a new ed25519 keypair
    const key = new Signer.Key();
    saveSecureValue(StorageKeys.PENDING_KEY, key.getPrivateKeyString());
    // Step 2 => Generate a Signed Key Request signature with "app FID"
    const address = new Eth.Address(APP_MNEMONIC);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // signature is valid for 1 day
    const signature = await address.signKeyRequest(
      APP_FID,
      key.getPublicKey(),
      deadline,
    );
    // Step 3 => Call warpcast API to get deep link and polling token
    const signedKeyParams: Warpcast.SignedKeyRequestParams = {
      key: key.getPublicKey(),
      signature,
      requestFid: APP_FID,
      deadline,
    };
    const signedKeyResponse = await new Warpcast.API().postSignedKeyRequest(
      signedKeyParams,
    );
    setPollingToken(signedKeyResponse.token);
    Linking.openURL(signedKeyResponse.deeplinkUrl);
  };

  return {
    connectedUserFid,
    warpcastConnected,
    isPolling,
    connectWithWarpcast,
    disconnectFromWarpcast,
  };
}
