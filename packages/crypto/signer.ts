import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { hexToBytes } from "@noble/hashes/utils";
import type { Hash } from "viem";

export class Key {
  private privateKey: Uint8Array;

  constructor(existingKey?: Uint8Array) {
    if (existingKey == undefined) {
      ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
      this.privateKey = ed.utils.randomPrivateKey();
    } else {
      this.privateKey = existingKey;
    }
  }

  public getPublicKey(): Hash {
    ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
    const publicKeyBytes = ed.getPublicKey(this.privateKey);
    return `0x${Buffer.from(publicKeyBytes).toString("hex")}`;
  }

  public getPrivateKey(): Uint8Array {
    return this.privateKey;
  }

  public getPrivateKeyString(): string {
    return Uint8ArrayToString(this.privateKey);
  }
}

export function Uint8ArrayToString(value: Uint8Array): string {
  return Buffer.from(value).toString("hex");
}

export function stringToUint8Array(value: string): Uint8Array {
  return hexToBytes(value);
}
