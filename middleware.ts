import { NextResponse, NextRequest } from "next/server";
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

// 여기에 명시된 경로는 유저 전용 경로
const USER_PATHS = [
  "/verify", // 학생 인증 페이지
  "/pending", // 가입 승인 대기 페이지
  "/deny", // 가입 거절 페이지
  "/ban", // 차단 안내 페이지
  "/objection", // 차단 이의신청 페이지
  "/my-posts", // 내 게시물 페이지
];

// 여기에 명시된 경로는 관리자 전용 경로
const ADMIN_PATHS = [
  "answerw", // 답변 작성 페이지
  "/noticew", // 공지사항 작성 페이지
  "/verireq", // 학생 인증 요청 관리 페이지
  "/report", // 신고 관리 페이지
  "/objreq", // 이의 제기 관리 페이지
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

        // 관리자용 예외 처리
        const isAdmin = info.role === "ADMIN";
        if (isAdmin) {
          if (USER_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
            // 관리자가 유저 전용 페이지 접근 시 차단
            if (IsHtmlNavigation(req)) {
              return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.json({ error: "forbidden" }, { status: 403 });
          }

          return res;
        }
        
        // 사용자 정보 쿠키 저장
        SaveInfo(res, protocol, info);

        // 사용자 상태에 따른 접근 제어
        const isCompleted = info.user.studentCertified === true && info.user.status === "가입 완료";
        const needVerify = info.user.studentCertified === false && info.user.status === "가입 대기 중";
        const isPending = info.user.studentCertified === true && info.user.status === "가입 대기 중";
        const isDenied = info.user.status === "가입 거절";
        const isBanned = info.user.status === "차단";

        // 차단 안된 사용자는 차단 페이지 접근 시 차단
        if (!isBanned && (pathname === "/ban" || pathname === "/objection")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/", req.url));
          }
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }

        // 차단된 사용자는 모든 페이지 접근 차단
        if (isBanned && !(pathname === "/ban" || pathname === "/objection")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/ban", req.url));
          }
          return NextResponse.json({ error: "banned_user" }, { status: 403 });
        }

        // 이미 인증 완료된 사용자가 인증 관련 페이지 접근 시 차단
        if (isCompleted && (pathname === "/pending" || pathname === "/verify" || pathname === "/deny")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/", req.url));
          }
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }

        // 학생 인증 필요 사용자가 인증 페이지 외 접근 시 차단
        if (needVerify && pathname !== "/verify") {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/verify", req.url));
          }
          return NextResponse.json({ error: "student_verification_required" }, { status: 403 });
        }

        // 가입 승인 대기 중 사용자가 대기 페이지 외 접근 시 차단
        if (isPending && pathname !== "/pending") {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/pending", req.url));
          }
          return NextResponse.json({ error: "pending_approval" }, { status: 403 });
        }

        // 가입 거절된 사용자가 거절 페이지 외 접근 시 차단
        if (isDenied && !(pathname === "/deny" || pathname === "/verify")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/deny", req.url));
          }
          return NextResponse.json({ error: "denied_approval" }, { status: 403 });
        }

        // 유저가 관리자 전용 페이지 접근 시 차단
        if (!isAdmin && ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/", req.url));
          }
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
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

        // 관리자용 예외 처리
        const isAdmin = info.role === "ADMIN";
        if (isAdmin) {
          if (USER_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
            // 관리자가 유저 전용 페이지 접근 시 차단
            if (IsHtmlNavigation(req)) {
              return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.json({ error: "forbidden" }, { status: 403 });
          }

          return res;
        }
        
        // 사용자 정보 쿠키 저장
        SaveInfo(res, protocol, info);

        // 사용자 상태에 따른 접근 제어
        const isCompleted = info.user.studentCertified === true && info.user.status === "가입 완료";
        const needVerify = info.user.studentCertified === false && info.user.status === "가입 대기 중";
        const isPending = info.user.studentCertified === true && info.user.status === "가입 대기 중";
        const isDenied = info.user.status === "가입 거절";
        const isBanned = info.user.status === "차단";

        // 차단 안된 사용자는 차단 페이지 접근 시 차단
        if (!isBanned && (pathname === "/ban" || pathname === "/objection")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/", req.url));
          }
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }

        // 차단된 사용자는 모든 페이지 접근 차단
        if (isBanned && !(pathname === "/ban" || pathname === "/objection")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/ban", req.url));
          }
          return NextResponse.json({ error: "banned_user" }, { status: 403 });
        }

        // 이미 인증 완료된 사용자가 인증 관련 페이지 접근 시 차단
        if (isCompleted && (pathname === "/pending" || pathname === "/verify" || pathname === "/deny")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/", req.url));
          }
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }

        // 학생 인증 필요 사용자가 인증 페이지 외 접근 시 차단
        if (needVerify && pathname !== "/verify") {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/verify", req.url));
          }
          return NextResponse.json({ error: "student_verification_required" }, { status: 403 });
        }

        // 가입 승인 대기 중 사용자가 대기 페이지 외 접근 시 차단
        if (isPending && pathname !== "/pending") {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/pending", req.url));
          }
          return NextResponse.json({ error: "pending_approval" }, { status: 403 });
        }

        // 가입 거절된 사용자가 거절 페이지 외 접근 시 차단
        if (isDenied && !(pathname === "/deny" || pathname === "/verify")) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/deny", req.url));
          }
          return NextResponse.json({ error: "denied_approval" }, { status: 403 });
        }

        // 유저가 관리자 전용 페이지 접근 시 차단
        if (!isAdmin && ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
          if (IsHtmlNavigation(req)) {
            return NextResponse.redirect(new URL("/", req.url));
          }
          return NextResponse.json({ error: "forbidden" }, { status: 403 });
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