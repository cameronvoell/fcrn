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
