# FCRN

FCRN - or Farcaster React Native takes inspiration from [Opencast for web](https://github.com/stephancill/opencast), and aims to provide a reference implementation for developers to create mobile apps for farcaster without starting from scratch.

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


