# fcrn

**Farcaster React Native** (or `fcrn`) takes inspiration from [Opencast for web](https://github.com/stephancill/opencast), and aims to provide a reference implementation for developers to create mobile apps for farcaster without starting from scratch.

Support development by voting for this project via Prop House PurpleDao retroactive funding: https://prop.house/proposal/8614

## Features Roadmap

- [x] Register Signer via Warpcast API
- [x] Persist Signer in encrypted storage
- [ ] Write to Hub Actions
  - [x] Signer flow working for Hub writes
  - [x] Like Button
  - [ ] Create Cast
  - [ ] Recast
- [x] Reading Data via Neynar API
  - [x] User Profiles
  - [x] Feed API
- [ ] Reading Data via Replicator 
- [ ] Profile Customization
- [ ] Feed Support
  - [x] Initial UI, API support


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


| Click Connect  | Pay in Warpcast | Poll for success | Signer stored |
| ------------- | ------------- | ------------- | ------------- |
| <img src="https://github.com/cameronvoell/fcrn/assets/1103838/f4cbefe6-dbc8-48b3-bcdf-6a2ffa5e4222" width="300">  | <img src="https://github.com/cameronvoell/fcrn/assets/1103838/b8701405-b803-4dfb-ac3b-6c0bf915e503" width="300">  | <img src="https://github.com/cameronvoell/fcrn/assets/1103838/416261a0-9667-4d3e-89c9-84aae7816b40" width="300"> | <img src="https://github.com/cameronvoell/fcrn/assets/1103838/9ab64837-e8c1-40c0-9452-c897a49c910b" width="300"> |


| Feed View  | User View |
| ------------- | ------------- |
| <img src="https://github.com/cameronvoell/fcrn/assets/1103838/5e6fb5fd-858c-4313-9880-e72d5ff3df2a" width="250"> | <img src="https://github.com/cameronvoell/fcrn/assets/1103838/fc213654-fdf3-47a1-a5e6-0e3dac104fbc" width="250"> |

## Integrate into an existing app

The following npm packages are available to install via your chosen package manager:

- [@fcrn/api](https://github.com/cameronvoell/fcrn/tree/main/packages/api)
- [@fcrn/crypto](https://github.com/cameronvoell/fcrn/tree/main/packages/crypto)

Click to see package README.md's and usage instructions.

## Feedback

Feel free to open an issue at https://github.com/cameronvoell/fcrn or reach out to me on Farcaster [@cyrcus](https://warpcast.com/cyrcus)

## License

MIT License










