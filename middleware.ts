import { NextResponse, NextRequest } from "next/server";
import JWTToken from "@/types/token";

// 퍼블릭 접근 허용 경로 (비로그인 허용)
const PUBLIC_PATHS = [
  "/login", // 로그인 페이지
  "/license",
  "/privacy",
  "/terms",
  "/api", // api 호출 허용
];

function isPublicPath(pathname: string) {
  if (pathname === "/") return true; // 홈만 공개
  if (pathname.startsWith("/_next/")) return true; // Next 정적 빌드 산출물
  if (pathname === "/favicon.ico") return true;
  // public 폴더 내 정적 파일 (확장자 포함 경로) 전부 허용
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  // prefix 매칭 ("/api/oauth" 같은)
  return PUBLIC_PATHS.some(p => {
    if (p.endsWith("/")) return pathname.startsWith(p);
    return pathname === p || pathname.startsWith(p + "/");
  });
}

async function silentlyReissue(refreshToken: string): Promise<JWTToken | null> {
  // 내부 API 호출
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/reissue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "refreshToken": refreshToken
      },
      // 캐시 무효화
      cache: "no-store"
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function SetJWTToken(res: NextResponse, tokens: JWTToken) {
  res.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  res.cookies.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
  });

  const nowSec = Math.floor(Date.now() / 1000);
  const expMs = (nowSec + tokens.expires_in) * 1000;
  res.cookies.set("access_exp", String(expMs), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  return res;
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const res = NextResponse.next();

  if (isPublicPath(pathname)) {
    return res;
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // access_exp 쿠키 기반 만료 판단 (없으면 만료로 간주)
  const expMs = req.cookies.get("access_exp") ? Number(req.cookies.get("access_exp")?.value) : NaN;
  const now = Date.now();
  // 시계 차이(grace) 2초 적용
  const GRACE_MS = 2000;
  const isExpired = !expMs || isNaN(expMs) || expMs - now <= GRACE_MS;

  // 토큰 없거나 만료 임박하면 로그인 페이지로
  if (!accessToken || isExpired) {
    if (refreshToken) {
      const reissued = await silentlyReissue(refreshToken);
      if (reissued) {
        return SetJWTToken(res, reissued);
      }
    }
    return redirectToLogin(req);
  }

  return res;
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.nextUrl.origin);
  const targetPath = req.nextUrl.pathname + (req.nextUrl.search || "");
  const res = NextResponse.redirect(loginUrl, 302);
  // 기존 쿼리 파라미터(return) 대신 쿠키 방식 사용 (SaveJWTToken 와 동일 키)
  if (targetPath && targetPath !== "/login") {
    // 보안 고려: 루트 시작 경로만 허용 (오픈 리다이렉트 방지)
    if (targetPath.startsWith("/")) {
      // 로그인 후 리다이렉트할 경로를 쿠키에 저장
      res.cookies.set("redirect_after_login", targetPath, { maxAge: 600 });
    }
  }
  return res;
}

export const config = {
  matcher: ["/:path*"]
};