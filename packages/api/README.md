# @fcrn/api

APIs for interacting with the Farcaster network, targeting React Native use cases.

## Features

- Register a signer via Warpcast app deeplink + API
- Fetch customized feeds or channels via the Neynar API
- Publish to the Farcaster network via your registered Signer and direct Hub connection

## Installation

Install @fcrn/api with the package manager of your choice

```
npm install @fcrn/api
yarn add @fcrn/api
pnpm install @fcrn/api
```

## Example Usage

### Register a Signer via Warpcast.API()

```typescript
import { Warpcast } from "@fcrn/api";
import { signer, eth } from "@fcrn/crypto";
import { APP_FID, APP_MNEMONIC } from "@env";

const connectWithWarpcast = async () => {
    // Step 1 => App generates a new ed25519 keypair
    const key = new signer.Key();
    saveSecureValue(StorageKeys.PENDING_KEY, key.getPrivateKeyString());
    // Step 2 => Generate a Signed Key Request signature with "app FID"
    const address = new eth.Address(APP_MNEMONIC);
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

### Fetch a Users Feed via Neynar API

```typescript
import { NEYNAR_API_KEY } from "@env";
import { Neynar } from "@fcrn/api";

export const fetchHomeFeedByFid = async (fid: string): Promise<Neynar.FeedTypes.CastV2[]> => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchFeedByFid(fid);
};
```

See [fcrn-example-app](https://github.com/cameronvoell/fcrn/tree/main/apps/fcrn-example-app) for more details

### Like a post via Direct Hub connection

```typescript
import { CastV2 } from "@fcrn/api/neynar/feed-types";
import { Hub } from "@fcrn/api";
import { signer } from "@fcrn/crypto";

import { HUB_URL } from "@env";

const toggleLike = async (castHash, isLiked, authorFid, likeCount) => {
    setLikeStatus({
      ...likeStatus,
      [castHash]: {
        isLiked: !isLiked,
        likeCount: isLiked ? likeCount - 1 : likeCount + 1,
      },
    });
    const hubApi = new Hub.API(HUB_URL);
    const signer_key_string = await getSecureValue(StorageKeys.SIGNING_KEY);
    const signer_key = signer.stringToUint8Array(signer_key_string);
    await hubApi.likeCast(
      authorFid,
      castHash,
      signer_key,
      isLiked,
      connectedFid,
    );
  };
```

See [fcrn-example-app](https://github.com/cameronvoell/fcrn/tree/main/apps/fcrn-example-app) for more details

## Feedback

Feel free to open an issue at https://github.com/cameronvoell/fcrn or reach out to me on Farcaster [@cyrcus](https://warpcast.com/cyrcus)

## License

MIT License
