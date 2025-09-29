import { NextResponse, NextRequest } from "next/server";
import JWT from "./types/token";
import Me from "./types/me";

// 여기에 명시된 경로는 인증 없이 접근 허용
const PUBLIC_PATHS = [
  "/login", // 로그인 페이지
  "/verify", // 학생 인증 페이지
  "/license", // 약관/라이선스
  "/privacy", // 개인정보 처리방침
  "/terms", // 서비스 이용약관
  "/oauth", // OAuth 콜백
];

// 시계 오차 허용
const GRACE_MS = 2000;

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

// 모든 쿠키를 일괄 삭제 (예외 지정 가능)
function ClearAllCookies(
  res: NextResponse,
  req: NextRequest,
  except: string[] = []
) {
  const all = req.cookies.getAll();
  for (const c of all) {
    if (!except.includes(c.name)) {
      res.cookies.delete(c.name);
    }
  }
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
  const { origin, pathname, protocol } = req.nextUrl;

  // JWT 확인
  const accessToken = GetCookie(req, "access_token");
  const refreshToken = GetCookie(req, "refresh_token");
  const accessExp = GetCookie(req, "access_exp");

  // JWT 없을 때
  if (!accessToken && !refreshToken) {
    const hasCookies = req.cookies.getAll().length > 0;

    // 로그인 필요 없는 페이지는 JWT 없어도 통과하되, 잔여 쿠키는 정리
    if (IsPublicPath(pathname)) {
      const res = NextResponse.next();
      if (hasCookies) ClearAllCookies(res, req);
      return res;
    }

    // 로그인 필요한 페이지는 로그인으로 리다이렉트 (HTML)
    if (IsHtmlNavigation(req)) {
      const res = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
      if (hasCookies) ClearAllCookies(res, req);
      return res;
    }

    // HTML 요청이 아니라면 401 JSON으로 응답
    const res = NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (hasCookies) ClearAllCookies(res, req);
    return res;
  }

  // 엑세스 토큰이 있다면 만료 상태 확인
  if (accessToken && accessExp) {
    const expTime = parseInt(accessExp);
    const now = Date.now();

    // JWT 만료 안됐다면 JWT 검증 시작
    if (expTime > now + GRACE_MS) {
      const infoRes = await fetch(`${origin}/oauth/me`, {
        headers: { "Authorization": accessToken! },
        cache: "no-store"
      });

      // JWT 검증 성공하면 통과
      if (infoRes.status === 200) {
        const info = await infoRes.json();

        const res = NextResponse.next();
        SaveInfo(res, protocol, info);
        
        // 학생 인증 여부 확인 (학생 인증 페이지가 아닌 경우에만)
        if (pathname !== "/verify" && !info.user.studentCertified) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/verify", req.url));
          }
          return NextResponse.json({ error: "student_verification_required" }, { status: 403 });
        }
        
        return res;
      }

      // JWT 검증 실패하면 모든 쿠키 삭제하고 로그인으로 리다이렉트
      if (IsHtmlNavigation(req)) {
        const res = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
        ClearAllCookies(res, req);
        return res;
      }

      // 브라우저 접근이 아니면 json으로 응답
      const res = NextResponse.json({ error: "unauthorized" }, { status: 401 });
      ClearAllCookies(res, req);
      return res;
    }
  }

  // JWT 만료되면 재발급 시작
  if (refreshToken) {
    const reissueRes = await fetch(`${origin}/oauth/reissue`, {
      headers: { "Authorization": refreshToken! },
      cache: "no-store"
    });

    // JWT 재발급 성공하면 통과
    if (reissueRes.status === 200) {
      const jwt = await reissueRes.json();

      const res = NextResponse.next()
      SaveJWT(res, protocol, jwt);
      
      // 새로운 액세스 토큰으로 사용자 정보 가져오기
      const infoRes = await fetch(`${origin}/oauth/me`, {
        headers: { "Authorization": jwt.access_token },
        cache: "no-store"
      });
      
      if (infoRes.status === 200) {
        const info = await infoRes.json();
        SaveInfo(res, protocol, info);
        
        // 학생 인증 여부 확인 (학생 인증 페이지가 아닌 경우에만)
        if (pathname !== "/verify" && !info.user.studentCertified) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/verify", req.url));
          }
          return NextResponse.json({ error: "student_verification_required" }, { status: 403 });
        }
      }
      
      return res;
    }

    // JWT 재발급 실패하면 모든 쿠키 삭제하고 로그인으로 리다이렉트
    if (IsHtmlNavigation(req)) {
      const res = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
      ClearAllCookies(res, req);
      return res;
    }

    // 브라우저 접근이 아니면 json으로 응답
    const res = NextResponse.json({ error: "unauthorized" }, { status: 401 });
    ClearAllCookies(res, req);
    return res;
  }
}