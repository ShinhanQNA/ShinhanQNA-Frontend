export interface KakaoAuthorizeParams {
  redirectUri: string;
  state?: string;
  scope?: string | string[];
  prompt?: string;
  throughTalk?: boolean;
}

export interface KakaoAuth {
  authorize(params: KakaoAuthorizeParams): void;
  cleanup(): void;
  getAccessToken(): String;
  getAppKey(): String;
  getStatusInfo(): Promise<Object|Object>;
  logout(): Promise<Object|Object>;
}

export interface KakaoSDK {
  init(key: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

export default interface KakaoTokenResponse {
  token_type: "bearer";
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
  id_token?: string;
};