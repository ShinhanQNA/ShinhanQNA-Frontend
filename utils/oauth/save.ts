import { NextResponse } from "next/server";
import GetCookie from "../cookie/get";
import { KakaoStateCookieCleanUp } from "./state";
import JWTToken from "@/types/token";
import SetJWTToken from "./set";

export default async function SaveJWTToken(origin: string, tokens: JWTToken): Promise<NextResponse> {
  const fallback = "/";
  const redirectCookie = await GetCookie("redirect_after_login");
  const targetPath = redirectCookie && redirectCookie.startsWith("/") ? redirectCookie : fallback;
  const response = NextResponse.redirect(new URL(targetPath, origin), 302);
  const isSecure = origin.startsWith("https://");

  // CSRF state 쿠키 정리
  KakaoStateCookieCleanUp(response);

  // 공통 토큰 쿠키 설정 함수 사용
  SetJWTToken(response, tokens, isSecure);

  // redirect_after_login 쿠키 제거
  response.cookies.set("redirect_after_login", "", { path: "/", maxAge: 0 });
  return response;
}