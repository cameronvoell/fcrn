import { NEYNAR_API_KEY } from "@env";
import { Neynar } from "farcaster-api";

export const fetchCastsByFid = async (fid: string) => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchCastsByFid(fid);
};

export const fetchUserDataByUsername = async (username: string) => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchUserDataByUsername(username);
};
