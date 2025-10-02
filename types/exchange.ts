export default interface JWTExchange {
  variant: "apple" | "google" | "kakao";
  token: string;
}