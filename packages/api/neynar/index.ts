import { CastV2 } from "./feed-types";

export * as FeedTypes from "./feed-types";

export interface UserData {
  pfp: string;
  displayName: string;
  username: string;
  fid: string;
  custodyAddress: string;
  followerCount: number;
  followingCount: number;
  profile: {
    bio: string;
  };
  activeStatus: string;
}

interface Author {
  fid: string;
}

interface Reactions {
  count: number;
  fids: number[];
}

interface Recasts {
  count: number;
  fids: number[];
}

interface ViewerContext {
  liked: boolean;
  recasted: boolean;
}

interface Replies {
  count: number;
}

export interface Cast {
  hash: string;
  parentHash: string | null;
  parentUrl: string | null;
  parentAuthor?: Author;
  author: Author;
  text: string;
  timestamp: string;
  embeds: string[];
  mentionedProfiles: string[];
  reactions: Reactions;
  recasts: Recasts;
  recasters: string[];
  viewerContext: ViewerContext;
  replies: Replies;
  threadHash: string | null;
}

export class API {
  private apiKey: string;
  private baseUrl: string = "https://api.neynar.com/";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key not provided. Please pass your NEYNAR API key.");
    }
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
      api_key: this.apiKey, // Ensures that the API key is included in every request
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  }

  public async fetchCastsByFid(fid: string): Promise<Cast[]> {
    const data = await this.request(
      `v1/farcaster/casts?fid=${fid}&viewerFid=${fid}&limit=25`,
      {
        method: "GET",
      },
    );
    return data.result.casts;
  }

  public async fetchFeedByFid(fid: string): Promise<CastV2[]> {
    const data = await this.request(
      `v2/farcaster/feed?feed_type=following&fid=${fid}&limit=25&with_recasts=true`,
      {
        method: "GET",
      },
    );
    return data.casts;
  }

  // Show Farcaster channel for now
  public async fetchLoggedOutFeed(): Promise<CastV2[]> {
    const data = await this.request(
      `v2/farcaster/feed?feed_type=filter&filter_type=parent_url&parent_url=chain%3A%2F%2Feip155%3A7777777%2Ferc721%3A0x4f86113fc3e9783cf3ec9a552cbb566716a57628&limit=25&with_recasts=false`,
      {
        method: "GET",
      },
    );
    return data.casts;
  }

  public async fetchUserDataByUsername(username: string): Promise<UserData> {
    const data = await this.request(
      `v1/farcaster/user-by-username?username=${username}`,
      {
        method: "GET",
      },
    );
    return data.result.user;
  }
}
