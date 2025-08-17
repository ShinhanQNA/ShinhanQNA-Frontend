import { NextResponse } from "next/server";
import { KakaoStateCookieCleanUp } from "@/utils/oauth/state";

export default function HandleError(error: any, requestUrl: string): NextResponse {
  const url = new URL(requestUrl);
  const errorType = error instanceof Error ? error.message : "internal_error";

  // 클라이언트에 노출할 수 있는 특정 에러 코드인 경우
  const knownErrors = ["token_exchange_failed", "unauthorized", "login_failed", "server_misconfigured"];
  if (knownErrors.includes(errorType)) {
    const redirectUrl = new URL("/login", url.origin);
    redirectUrl.searchParams.set("error", errorType);
    
  const response = NextResponse.redirect(redirectUrl, 302);
  // CSRF state 쿠키 정리
  KakaoStateCookieCleanUp(response);
  return response;
  }

  // 그 외의 모든 예상치 못한 에러
  console.error(error);
  return NextResponse.json({ error: "internal_error" }, { status: 500 });
}