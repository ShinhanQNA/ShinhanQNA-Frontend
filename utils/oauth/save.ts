import { NextResponse } from "next/server";
import GetCookie from "../cookie/get";
import DeleteCookie from "../cookie/delete";
import SetJWT from "./set";
import JWT from "@/types/token";

export default async function SaveJWT(
  origin: string,
  tokens: JWT
): Promise<
  NextResponse
> {
  const fallback = "/";
  const redirectCookie = await GetCookie("redirect_after_login");
  const targetPath = redirectCookie && redirectCookie.startsWith("/") ? redirectCookie : fallback;
  const response = NextResponse.redirect(new URL(targetPath, origin), 302);

  // CSRF state 쿠키 정리
  DeleteCookie("oauth_state");

  // 공통 토큰 쿠키 설정 함수 사용
  SetJWT(tokens);

  // redirect_after_login 쿠키 제거
  DeleteCookie("redirect_after_login");
  return response;
}