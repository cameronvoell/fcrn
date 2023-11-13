export interface SignedKeyRequest {
  token: string;
  deeplinkUrl: string;
}

export interface SignedKeyRequestParams {
  key: string;
  signature: string;
  requestFid: number;
  deadline: number;
}

export interface SignedKeyRequestResult {
  token: string;
  deeplinkUrl: string;
  key: string;
  requestFid: number;
  state: string;
  userFid: number;
}

export class API {
  private baseUrl: string = "https://api.warpcast.com/";

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    };

    // The body needs to be a JSON string for a POST request.
    // We'll ensure that we stringify it if it's not already a string.
    const body =
      options.method === "POST" && options.body ? options.body : undefined;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      body, // Add the body to the request if it's a POST.
    });

    const data = await response.json();
    return data;
  }

  public async postSignedKeyRequest(
    params: SignedKeyRequestParams,
  ): Promise<SignedKeyRequest> {
    const data = await this.request(`v2/signed-key-requests`, {
      method: "POST",
      body: JSON.stringify(params),
    });
    return data.result.signedKeyRequest;
  }

  public async pollForSigner(token: string): Promise<SignedKeyRequestResult> {
    const data = await this.request(`v2/signed-key-request?token=${token}`, {
      method: "GET",
    });
    return data.result.signedKeyRequest;
  }
}
