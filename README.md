# fcrn

FCRN - or Farcaster React Native takes inspiration from [Opencast for web](https://github.com/stephancill/opencast), and aims to provide a reference implementation for developers to create mobile apps for farcaster without starting from scratch.

Support development by voting for this project via Prop House PurpleDao retroactive funding: https://prop.house/proposal/8614

## Build Example App

See Expo docs for machine setup (Node.js, Git, Watchman, etc.): https://docs.expo.dev/get-started/installation/

1. `cp EXAMPLE.env .env` and fill in the mising values:
```
NEYNAR_API_KEY=<SEE https://neynar.com/>
HUB_URL=<http://<YOUR_SERVER_IP:2281>>
APP_FID=<FID_ASSOCIATED_WITH_OUR_APP>
APP_MNEMONIC=<MNEUMONIC_PRIVATE_KEY_FOR_APP_FID_CUSTODY_ADDRESS>
```
2. From root directory `yarn install` to install repo dependencies
3. run `yarn dev` to start expo
4. Follow terminal instructions for testing the app on your iPhone or Android via the Expo Go mobile app.

## The fcrn-example-app currently supports the following functionality:

1. Register Signer via Warpcast Deeplink
2. Persist Signer in encrypted Storage
3. Fetch Feed and User Data via Neynar APIs
4. Like posts via a Hub API using your registered, persisted signer


| Click Connect  | Pay in WarpCast, see load | Poll for success | Signer is stored Successfully |
| ------------- | ------------- | ------------- | ------------- |
| ![Screenshot_20231112-200614_Expo Go](https://github.com/cameronvoell/fcrn/assets/1103838/f4cbefe6-dbc8-48b3-bcdf-6a2ffa5e4222)  | ![Screenshot_20231112-201526_Warpcast](https://github.com/cameronvoell/fcrn/assets/1103838/b8701405-b803-4dfb-ac3b-6c0bf915e503)  | ![Screenshot_20231112-201531_Expo Go](https://github.com/cameronvoell/fcrn/assets/1103838/416261a0-9667-4d3e-89c9-84aae7816b40) | ![Screenshot_20231112-200519_Expo Go](https://github.com/cameronvoell/fcrn/assets/1103838/9ab64837-e8c1-40c0-9452-c897a49c910b) |








