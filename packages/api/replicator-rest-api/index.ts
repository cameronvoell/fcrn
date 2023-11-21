export interface Reaction {
  reaction_id: string;
  reaction_created_at: string;
  reaction_updated_at: string;
  reaction_timestamp: string;
  reaction_deleted_at: string | null;
  reaction_fid: number;
  reaction_target_cast_fid: number;
  reaction_type: number;
  reaction_hash: string;
  reaction_target_cast_hash: string;
  reaction_target_url: string | null;
}

export interface Embed {
  url: string;
}

export interface Cast {
  id: string;
  cast_created_at: string;
  cast_updated_at: string;
  cast_timestamp: string;
  cast_deleted_at: string | null;
  cast_fid: number;
  cast_parent_fid: number;
  cast_hash: string;
  cast_root_parent_hash: string;
  cast_parent_hash: string;
  cast_root_parent_url: string | null;
  cast_parent_url: string | null;
  cast_text: string;
  cast_embeds: Embed[];
  cast_mentions: any[]; // Replace any with a specific type if applicable
  cast_mentions_positions: any[]; // Replace any with a specific type if needed
  reactions: Reaction[];
  username: string;
}

export const ChannelMapping: { [key: string]: string } = {
  farcaster:
    "chain://eip155:7777777/erc721:0x4f86113fc3e9783cf3ec9a552cbb566716a57628",
  dev: "chain://eip155:1/erc721:0x7dd4e31f1530ac682c8ea4d8016e95773e08d8b0",
  memes: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
  food: "chain://eip155:1/erc721:0xec0ba367a6edf483a252c3b093f012b9b1da8b3f",
};

export class API {
  private baseUrl: string;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error(
        "Replicator API baseUrl not provided. Please pass your Replicator api baseUrl",
      );
    }
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json();
    return data;
  }

  public async fetchChannel(channel: string): Promise<Cast[]> {
    const data = await this.request(
      `/cast_with_reactions_username?cast_root_parent_url=eq.${ChannelMapping[channel]}&order=cast_timestamp.desc&limit=25`,
      {
        method: "GET",
      },
    );
    return data;
  }
}
