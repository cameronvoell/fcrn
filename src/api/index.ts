import { NEYNAR_API_KEY } from "@env";
import NeynarAPI from "../../packages/farcaster-api/neynar";


export const fetchCastsByFid = async (fid: string) => {
  const neynarAPI = new NeynarAPI(NEYNAR_API_KEY);
  return await neynarAPI.fetchCastsByFid(fid);
};

export const fetchUserDataByUsername = async (username: string) => {
  const neynarAPI = new NeynarAPI(NEYNAR_API_KEY);
  return await neynarAPI.fetchUserDataByUsername(username);
};
