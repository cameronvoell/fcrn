export interface CastAuthor {
  object: "user";
  fid: number | null;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles: string[]; // Define a more specific type if possible
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  active_status: string;
}

export interface Like {
  fid: number;
  fname: "string";
}

export interface CastV2 {
  hash: string;
  thread_hash: string | null;
  parent_hash: string | null;
  parent_url: string;
  parent_author: {
    fid: number | null;
  };
  author: CastAuthor;
  text: string;
  timestamp: string; // or Date if you will convert string to Date object
  embeds: string[]; // Define a more specific type if possible
  reactions: {
    likes: Like[]; // Define a more specific type if possible
    recasts: string[]; // Define a more specific type if possible
  };
  replies: {
    count: number;
  };
  mentioned_profiles: string[]; // Define a more specific type if possible
}

export interface FeedResponse {
  casts: CastV2[];
  next: {
    cursor: string;
  };
}
