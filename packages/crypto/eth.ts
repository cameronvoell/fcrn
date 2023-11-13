/*** EIP-712 helper code ***/
import { mnemonicToAccount, HDAccount } from "viem/accounts";
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

export class Address {
  private account: HDAccount;

  constructor(mnemonic: string) {
    this.account = mnemonicToAccount(mnemonic);
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
