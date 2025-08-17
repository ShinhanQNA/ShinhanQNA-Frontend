import { NextResponse } from "next/server";

// 카카오 OAuth CSRF 방지 state 쿠키 제거
export function KakaoStateCookieCleanUp(res: NextResponse) {
  res.cookies.set("kakao_oauth_state", "", { path: "/", maxAge: 0 });
}
