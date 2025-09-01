import { NextResponse, NextRequest } from "next/server";
import GetMe from "./utils/user/get";

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

function isPublicPath(pathname: string) {
  // 슬래시로 끝나는 항목은 prefix 매칭, 아닐 경우 exact 또는 하위 경로 매칭
  return PUBLIC_PATHS.some((p) => {
    if (p.endsWith("/")) return pathname.startsWith(p);
    return pathname === p || pathname.startsWith(p + "/");
  });
}

function isHtmlNavigation(req: NextRequest) {
  // 브라우저 탐색(문서 요청)인지 식별: Accept 헤더에 text/html 포함 여부로 판단
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

export default async function middleware(req: NextRequest) {
  const { pathname, search, protocol } = req.nextUrl;

  // 공개 경로는 통과
  if (isPublicPath(pathname)) return NextResponse.next();

  // 액세스 토큰 요구 (쿠키: access_token)
  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    // 브라우저 탐색이면 로그인으로 리다이렉트 + "redirect_after_login" 쿠키 설정
    if (isHtmlNavigation(req)) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("redirect_after_login", pathname + search, {
        httpOnly: true,
        sameSite: "lax",
        secure: protocol === "https:", // HTTPS일 때만 Secure 쿠키
        path: "/",
      });
      return res;
    }
    // 데이터/API 요청이면 401 반환
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // JWT 서명/만료 검증
  try {
    await GetMe();
    // 검증 성공 → 통과
    return NextResponse.next();
  } catch {
    // 검증 실패(만료/서명 오류 등)
    if (isHtmlNavigation(req)) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("redirect_after_login", pathname + search, {
        httpOnly: true,
        sameSite: "lax",
        secure: protocol === "https:",
        path: "/",
      });
      return res;
    }
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}