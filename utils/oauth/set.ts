import { NextResponse } from "next/server";
import JWTToken from "@/types/token";

export default function SetJWTToken(res: NextResponse, tokens: JWTToken, isSecure: boolean) {
  res.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  res.cookies.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  // access_exp: 만료 시각 (epoch ms) - 디코딩 없이 만료 판단용. HttpOnly 아님 (단, 민감정보 아님)
  const nowSec = Math.floor(Date.now() / 1000);
  const expMs = (nowSec + tokens.expires_in) * 1000;
  res.cookies.set("access_exp", String(expMs), {
    httpOnly: false,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  return res;
}
