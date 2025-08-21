import { NextRequest, NextResponse } from "next/server";
import Reissue from "@/utils/oauth/reissue";
import SetJWTToken from "@/utils/oauth/set";

export async function POST(req: NextRequest) {
  // request-header로 refresh_token 받기
  const reqHeaders = new Headers(req.headers)
  const refreshToken = reqHeaders.get("refreshToken");
  if (!refreshToken) {
    return NextResponse.json({ error: "no_refresh_token" }, { status: 401 });
  }

  const data = await Reissue(refreshToken);
  if (!data) {
    return NextResponse.json({ error: "reissue_failed" }, { status: 401 });
  }

  // 토큰을 즉시 갱신해서 반환
  const res = NextResponse.json({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in
  });
  SetJWTToken(data);
  return res;
}

export const dynamic = "force-dynamic"; // 캐시 방지