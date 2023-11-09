import { NEYNAR_API_KEY } from "@env";
import { Neynar } from "farcaster-api";
import { CastV2 } from "farcaster-api/neynar/feed-types";


export const fetchCastsByFid = async (fid: string) => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchCastsByFid(fid);
};

export const fetchHomeFeedByFid = async (fid: string): Promise<CastV2[]> => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchFeedByFid(fid);
};

export const fetchLoggedOutFeed = async (): Promise<CastV2[]> => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchLoggedOutFeed();
};

export const fetchUserDataByUsername = async (username: string) => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchUserDataByUsername(username);
};
