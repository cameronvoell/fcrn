# @fcrn/crypto

Cryptographic functions that are useful for interacting with the Farcaster network, targeting React Native use cases.

## Installation

Install @fcrn/crypto with the package manager of your choice

```
npm install @fcrn/crypto
yarn add @fcrn/crypto
pnpm install @fcrn/crypto
```

## Example Usage

### Create a Signer + Sign via Ethereum Mneumonic

```typescript
import { Warpcast } from "@fcrn/api";
import { Signer, Eth } from "@fcrn/crypto";
import { APP_FID, APP_MNEMONIC } from "@env";

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
```

See [fcrn-example-app](https://github.com/cameronvoell/fcrn/tree/main/apps/fcrn-example-app) for more details

## Feedback

Feel free to open an issue at https://github.com/cameronvoell/fcrn or reach out to me on Farcaster [@cyrcus](https://warpcast.com/cyrcus)

## License

MIT License