import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

export class Key {
  private privateKey: Uint8Array;

  constructor(existingKey?: Uint8Array) {
    if (existingKey == undefined) {
      ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));
      ed.etc.sha512Async = (...m) => Promise.resolve(ed.etc.sha512Sync(...m));
      this.privateKey = ed.utils.randomPrivateKey();
    } else {
      this.privateKey = existingKey;
    }
  }

  public getPublicKey(): string {
    const publicKeyBytes = ed.getPublicKey(this.privateKey);
    return Buffer.from(publicKeyBytes).toString("hex");
  }
}
