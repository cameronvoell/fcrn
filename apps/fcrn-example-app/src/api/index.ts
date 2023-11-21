import { NEYNAR_API_KEY, REPLICATOR_REST_API } from "@env";
import { Neynar } from "@fcrn/api";
import { ReplicatorApi } from "@fcrn/api";

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

export const fetchChannelByName = async (
  channel: string,
): Promise<ReplicatorApi.Cast[]> => {
  const replicatorAPI = new ReplicatorApi.API(REPLICATOR_REST_API);
  return await replicatorAPI.fetchChannel(channel);
};
