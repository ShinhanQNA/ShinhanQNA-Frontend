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

// 시계 차이(grace) (ms)
const GRACE_MS = 2000;

// 공통 쿠키 설정 기본값
const SECURE = process.env.NODE_ENV === "production";

// 퍼블릭 경로 여부
function isPublicPath(pathname: string) {
  if (pathname === "/") return true; // 홈만 공개
  if (pathname.startsWith("/_next/")) return true; // Next 정적 빌드 산출물
  if (pathname === "/favicon.ico") return true;
  // public 폴더 내 정적 파일 (확장자 포함 경로) 전부 허용
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  // prefix 매칭 ("/api/oauth" 같은)
  return PUBLIC_PATHS.some((p) => {
    if (p.endsWith("/")) return pathname.startsWith(p);
    return pathname === p || pathname.startsWith(p + "/");
  });
}

// access_exp 쿠키 기반 만료 판단 (없으면 만료로 간주)
function isAccessExpired(expMsCookie?: string | undefined) {
  if (!expMsCookie) return true;
  const expMs = Number(expMsCookie);
  if (Number.isNaN(expMs)) return true;
  return expMs - Date.now() <= GRACE_MS;
}

// 내부 API 호출: 리프레시로 무음 재발급
async function silentlyReissue(origin: string, refreshToken: string): Promise<JWTToken | null> {
  try {
    const res = await fetch(`${origin}/api/oauth/reissue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "refreshToken": refreshToken,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as JWTToken;
  } catch {
    return null;
  }
}

// 공통 토큰 쿠키 설정
function setJWTToken(res: NextResponse, tokens: JWTToken) {
  res.cookies.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  res.cookies.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 1주
  });

  // access_exp: 만료 시각 (epoch ms) - 디코딩 없이 만료 판단용. HttpOnly 아님 (민감정보 아님)
  const nowSec = Math.floor(Date.now() / 1000);
  const expMs = (nowSec + tokens.expires_in) * 1000;
  res.cookies.set("access_exp", String(expMs), {
    httpOnly: false, // 클라/미들웨어에서 읽기 가능하도록
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.expires_in,
  });

  return res;
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/login", req.nextUrl.origin);
  const targetPath = req.nextUrl.pathname + (req.nextUrl.search || "");
  const res = NextResponse.redirect(loginUrl, 302);

  // 기존 쿼리 파라미터(return) 대신 쿠키 방식 사용
  if (targetPath && targetPath !== "/login" && targetPath.startsWith("/")) {
    // 로그인 후 리다이렉트할 경로를 쿠키에 저장 (오픈 리다이렉트 방지)
    res.cookies.set("redirect_after_login", targetPath, {
      httpOnly: true,
      secure: SECURE,
      sameSite: "lax",
      path: "/",
    });
  }
  return res;
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // 매 요청 기본 응답
  const baseRes = NextResponse.next();

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const accessExp = req.cookies.get("access_exp")?.value;
  const expired = isAccessExpired(accessExp);

  // 퍼블릭 경로: 토큰이 없거나 만료이면 조용히 재발급 시도 (성공 시 쿠키만 세팅 후 그대로 통과)
  if (isPublicPath(pathname)) {
    if (!accessToken || expired) {
      if (refreshToken) {
        const issued = await silentlyReissue(req.nextUrl.origin, refreshToken);
        if (issued) {
          return setJWTToken(baseRes, issued);
        }
      }
    }
    return baseRes;
  }

  // 보호 경로: 토큰 없거나 만료면 재발급; 실패 시 로그인으로
  if (!accessToken || expired) {
    if (refreshToken) {
      const issued = await silentlyReissue(req.nextUrl.origin, refreshToken);
      if (issued) {
        return setJWTToken(baseRes, issued);
      }
    }
    return redirectToLogin(req);
  }

  // 유효 토큰 통과
  return baseRes;
}

export const config = {
  matcher: ["/:path*"],
};