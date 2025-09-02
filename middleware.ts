import { NextResponse, NextRequest } from "next/server";
import DoReissue from "./utils/oauth/reissue";
import GetMe from "./utils/user/get";
import JWT from "./types/token";
import Me from "./types/me";

// 여기에 명시된 경로는 인증 없이 접근 허용
const PUBLIC_PATHS = [
  "/login", // 로그인 페이지
  "/license", // 약관/라이선스
  "/privacy", // 개인정보 처리방침
  "/terms", // 서비스 이용약관
  "/oauth", // OAuth 콜백
];

// 정적 리소스와 Next 내부 경로는 제외하고 나머지 경로에 미들웨어 적용
export const config = {
  matcher: [
    "/((?!_next/|favicon.ico|robots.txt|sitemap.xml|campus_main\\.).*)",
  ],
};

function IsPublicPath(
  pathname: string
) {
  if (pathname === "/") return true; // 루트 경로는 공개
  // 슬래시로 끝나는 항목은 prefix 매칭, 아닐 경우 exact 또는 하위 경로 매칭
  return PUBLIC_PATHS.some((p) => {
    if (p.endsWith("/")) return pathname.startsWith(p);
    return pathname === p || pathname.startsWith(p + "/");
  });
}

function IsHtmlNavigation(
  req: NextRequest
) {
  // 브라우저 탐색(문서 요청)인지 식별: Accept 헤더에 text/html 포함 여부로 판단
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

// 미들웨어 쿠키 조회 함수
function GetCookie(
  req: NextRequest,
  key: string
) {
  return req.cookies.get(key)?.value;
}

// 미들웨어 쿠키 설정 함수
function SetCookie(
  res: NextResponse,
  key: string,
  value: string,
  protocol: string,
  maxAge?: number
) {
  res.cookies.set(key, value, {
    httpOnly: true,
    secure: protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: maxAge
  });
}

// 미들웨어 쿠키 삭제 함수
function DeleteCookie(
  res: NextResponse,
  key: string
) {
  res.cookies.delete(key);
}

// 미들웨어 JWT 쿠키 저장 함수
function SaveJWT(
  res: NextResponse,
  protocol: string,
  tokens: JWT
) {
  SetCookie(
    res,
    "access_token",
    tokens.access_token,
    protocol,
    tokens.expires_in
  );
  SetCookie(
    res,
    "refresh_token",
    tokens.refresh_token,
    protocol,
    7 * 24 * 60 * 60
  );

  // access_exp: 만료 시각 (epoch ms) - 디코딩 없이 만료 판단용. HttpOnly 아님 (단, 민감정보 아님)
  const nowSec = Math.floor(Date.now() / 1000);
  const expMs = (nowSec + tokens.expires_in) * 1000;
  SetCookie(
    res,
    "access_exp",
    String(expMs),
    protocol,
    tokens.expires_in
  )
}

function SaveInfo(
  res: NextResponse,
  protocol: string,
  info: Me
) {
  // 유저 이메일 정보
  SetCookie(
    res,
    "email",
    info.user.email,
    protocol
  )

  // 유저 가입 상태 정보
  SetCookie(
    res,
    "status",
    info.user.status,
    protocol
  )

  // 유저 학생 인증 상태 정보
  SetCookie(
    res,
    "studentCertified",
    info.user.studentCertified ? "true" : "false",
    protocol
  )

  // 유저 경고 정보
  SetCookie(
    res,
    "warnings",
    JSON.stringify(info.warnings),
    protocol
  )
}

export default async function middleware(req: NextRequest) {
  const { pathname, protocol } = req.nextUrl;

  // JWT 확인
  const accessToken = GetCookie(req, "access_token");
  const refreshToken = GetCookie(req, "refresh_token");

  if (!accessToken) {
    if (!refreshToken) {
      // 공개 경로는 JWT 없어도 통과
      if (IsPublicPath(pathname)) return NextResponse.next();

      // JWT가 아예 없고 브라우저 탐색이면 로그인으로 리다이렉트
      if (IsHtmlNavigation(req)) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
    }

    try {
      // 리프레시 토큰으로 JWT 재발급 시도
      const jwt = await DoReissue(refreshToken!);

      // JWT 재발급 성공 시 JWT 저장
      const res = NextResponse.next();
      SaveJWT(res, protocol, jwt);
      return res;
    } catch {
      // 리프레시 토큰 재발급 실패 시 모든 쿠키 삭제
      const cookie = req.cookies.getAll();
      for (const c of cookie) DeleteCookie(NextResponse.next(), c.name);

      // 로그인 페이지로 리다이렉트
      if (IsHtmlNavigation(req)) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
    }

    // 데이터/API 요청이면 401 반환
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // JWT 서명/만료 검증
  try {
    const info = await GetMe();

    // 검증 성공시 저장
    const res = NextResponse.next();
    SaveInfo(res, protocol, info);
    return res;
  } catch {
    // 로그인 페이지로 리다이렉트
    if (IsHtmlNavigation(req)) {
      // 토큰 검증 실패 시 모든 쿠키 삭제
      const res = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
      const cookie = req.cookies.getAll();
      for (const c of cookie) DeleteCookie(res, c.name);
      return res;
    }
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}