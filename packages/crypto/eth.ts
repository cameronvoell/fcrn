/*** EIP-712 helper code ***/
import { mnemonicToAccount, HDAccount } from "viem/accounts";
import { Signer } from "@ethersproject/abstract-signer";
import { Bytes } from "@ethersproject/bytes";

import type { Hash } from "viem";

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

function convertBytesToByteArray(bytes: Bytes): Uint8Array {
  // If bytes is already Uint8Array, return it directly
  if (bytes instanceof Uint8Array) {
    return bytes;
  }

  // If bytes is an array-like object, convert it to Uint8Array
  return new Uint8Array(bytes);
}

export class Address extends Signer {
  getAddress(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  signMessage(message: string | Bytes): Promise<string> {
    if (typeof message === "string") {
      return this.account.signMessage({ message });
    } else {
      const messageBytes = convertBytesToByteArray(message);
      return this.account.signMessage({ message: { raw: messageBytes } });
    }
  }

  signTransaction(_transaction): Promise<string> {
    throw new Error("Method not implemented.");
  }
  connect(_provider): Signer {
    throw new Error("Method not implemented.");
  }
  private account: HDAccount;

  constructor(mnemonic: string) {
    super();
    this.account = mnemonicToAccount(mnemonic);
  }

  public getAddressString(): string {
    return this.account.address;
  }

  public async signKeyRequest(
    app_fid: number,
    key: Hash,
    deadline: number,
  ): Promise<Hash> {
    return await this.account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: "SignedKeyRequest",
      message: {
        requestFid: BigInt(app_fid),
        key,
        deadline: BigInt(deadline),
      },
    });
  }
}
