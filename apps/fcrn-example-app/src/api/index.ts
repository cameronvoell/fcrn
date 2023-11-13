import { NEYNAR_API_KEY } from "@env";
import { Neynar } from "@fcrn/api";

export const fetchCastsByFid = async (fid: string) => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchCastsByFid(fid);
};

export const fetchHomeFeedByFid = async (
  fid: string,
): Promise<Neynar.FeedTypes.CastV2[]> => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchFeedByFid(fid);
};

export const fetchLoggedOutFeed = async (): Promise<
  Neynar.FeedTypes.CastV2[]
> => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchLoggedOutFeed();
};

export const fetchUserDataByUsername = async (username: string) => {
  const neynarAPI = new Neynar.API(NEYNAR_API_KEY);
  return await neynarAPI.fetchUserDataByUsername(username);
};
