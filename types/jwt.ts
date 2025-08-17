export interface BackendJWTResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export interface BackendJWTRequest {
  variant: "apple" | "google" | "kakao";
  token: string;
}