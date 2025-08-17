import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import GetJWTToken from "@/utils/oauth/get";
import SaveJWTToken from "@/utils/oauth/save";
import HandleError from "@/utils/oauth/error";
import KakaoTokenResponse from "@/types/kakao";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // 인가 코드 및 state 파라미터 확인
    if (!code || !state) {
      return NextResponse.json(
        { error: "인가 코드 또는 state가 없습니다." },
        { status: 400 },
      );
    }

    // CSRF 공격 방지를 위한 state 검증 (Double Submit Cookie)
    const cookieStore = await cookies();
    const savedState = cookieStore.get("oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return NextResponse.json(
        { error: "유효하지 않은 state입니다." },
        { status: 400 },
      );
    }

    // 카카오에 토큰 요청
    const kakaoToken = await GetKakaoToken(code);

    // 백엔드 서버에 토큰 전달 및 서비스 토큰 발급
    const backendToken = await GetJWTToken({
      variant: "kakao",
      token: kakaoToken.access_token
    });

    // 성공 처리: 토큰을 쿠키에 저장하고 리디렉션
    return SaveJWTToken(origin, backendToken);
  } catch (error) {
    // 모든 과정에서 발생한 에러 처리
    return HandleError(error, req.url);
  }
}

async function GetKakaoToken(code: string): Promise<KakaoTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const clientSecret = process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("카카오 인증 환경변수가 설정되지 않았습니다.");
    throw new Error("server_misconfigured");
  }

  const tokenUrl = "https://kauth.kakao.com/oauth/token";
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("카카오 토큰 교환 실패", {
      status: response.status,
      statusText: response.statusText,
      body: await response.text(),
    });
    throw new Error("token_exchange_failed");
  }

  return response.json();
}