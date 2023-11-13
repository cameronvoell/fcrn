import {
  Message,
  FarcasterNetwork,
  makeReactionAdd,
  makeReactionRemove,
  NobleEd25519Signer,
  ReactionType,
  toFarcasterTime,
} from "@farcaster/core";
import axios from "axios";
import { stringToUint8Array } from "farcaster-crypto/signer";

export class API {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error("Hub baseUrl not provided. Please pass your Hub baseUrl");
    }
    this.baseUrl = baseUrl;
  }

  public async likeCast(
    target_fid: number,
    targetHashString: string,
    signer: Uint8Array,
    isRemoval: boolean = false,
    userFid: number,
  ) {
    const ed25519Signer = new NobleEd25519Signer(signer);
    const farcasterTimestamp = toFarcasterTime(Date.now())._unsafeUnwrap();
    const dataOptions = {
      fid: userFid,
      network: FarcasterNetwork.MAINNET,
      timestamp: farcasterTimestamp,
    };
    const postConfig = {
      headers: { "Content-Type": "application/octet-stream" },
    };
    const body = {
      type: ReactionType.LIKE,
      targetCastId: {
        fid: target_fid,
        hash: convertCastHashStringToUint8Array(targetHashString),
      },
    };
    const reactionMsg = isRemoval
      ? await makeReactionRemove(body, dataOptions, ed25519Signer)
      : await makeReactionAdd(body, dataOptions, ed25519Signer);
    const messageBytes = Buffer.from(
      Message.encode(reactionMsg._unsafeUnwrap()).finish(),
    );
    try {
      const url = this.baseUrl + "/v1/submitMessage";
      const response = await axios.post(url, messageBytes, postConfig);
      return response;
    } catch (e) {
      // handle errors
      console.error("Error submitting message: ", e);
    }
  }
}

function convertCastHashStringToUint8Array(hash: string): Uint8Array {
  return stringToUint8Array(hash.slice(2));
}
