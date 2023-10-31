import { NEYNAR_API_KEY } from '@env';


const BASE_URL = "https://api.neynar.com/";
const API_KEY = NEYNAR_API_KEY || "";

if (!API_KEY) {
  console.error("API_KEY not found. Make sure to set it in your .env file.");
}

export const fetchCastsByFid = async (fid: string) => {
  const response = await fetch(
    `${BASE_URL}v1/farcaster/casts?fid=${fid}&viewerFid=${fid}&limit=25`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        api_key: API_KEY,
      },
    }
  );
  const data = await response.json();
  return data.result.casts;
};

export const fetchUserDataByUsername = async (username: string) => {
  const response = await fetch(
    `${BASE_URL}v1/farcaster/user-by-username?username=${username}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        api_key: API_KEY,
      },
    }
  );
  const data = await response.json();
  return data.result.user;
};
