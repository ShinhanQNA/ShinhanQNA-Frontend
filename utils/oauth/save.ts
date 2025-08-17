import { NextResponse } from "next/server";
import { BackendJWTResponse } from "@/types/jwt";
import { KakaoStateCookieCleanUp } from "./state";

export default function SaveJWTToken(origin: string, tokens: BackendJWTResponse): NextResponse {
  const response = NextResponse.redirect(new URL("/", origin), 302);
  const isSecure = origin.startsWith("https://");

  // CSRF state 쿠키 정리 (공용 함수)
  KakaoStateCookieCleanUp(response);

  // 서비스 액세스 토큰 설정 (HttpOnly, Secure, SameSite=Lax)
  response.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  // 서비스 리프레시 토큰 설정 (HttpOnly, Secure, SameSite=Lax)
  response.cookies.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}