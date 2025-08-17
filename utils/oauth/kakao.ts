import type { KakaoAuthorizeParams } from "@/types/kakao";

export async function WaitForKakaoReady(timeoutMs = 5000): Promise<void> {
  const start = Date.now();

  // 스크립트가 window에 올라올 때까지 대기
  while (typeof window === "undefined" || !("Kakao" in window)) {
    if (Date.now() - start > timeoutMs) {
      throw new Error("Kakao SDK load timed out");
    }
    await new Promise((r) => setTimeout(r, 50));
  }

  const K = window.Kakao!;
  // init되지 않았으면 여기서 초기화
  if (!K.isInitialized()) {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) throw new Error("Missing NEXT_PUBLIC_KAKAO_JS_KEY");
    K.init(key);
  }
}

function GenState() {
  // CSRF 방지용 state
  if (typeof window === "undefined") return "";
  // Web Crypto API: 안전한 난수. 두 개의 32-bit 숫자를 결합해 충돌 가능성 낮춤
  const s = crypto.getRandomValues(new Uint32Array(2)).join("-");
  // 로그인 흐름 중복 탭 대비를 위해 세션 범위에 저장
  sessionStorage.setItem("kakao_oauth_state", s);
  // 서버에서 더블 서브밋 쿠키 방식으로 state 검증을 수행할 수 있도록 쿠키도 설정
  // HttpOnly는 클라이언트에서 설정 불가하므로 SameSite=Lax로 CSRF 리스크를 낮춥니다.
  const isSecure = window.location.protocol === "https:";
  const attrs = [
    "Path=/",
    "SameSite=Lax",
    // 10분 유효
    "Max-Age=600",
    isSecure ? "Secure" : "",
  ].filter(Boolean);
  document.cookie = `kakao_oauth_state=${encodeURIComponent(s)}; ${attrs.join("; ")}`;

  return s;
}

export async function KakaoAuthorize(params: KakaoAuthorizeParams) {
  await WaitForKakaoReady();
  const K = window.Kakao!;
  // state 미지정 시 자동 생성하여 sessionStorage에 보관
  const state = params.state ?? GenState();

  K.Auth.authorize({
    redirectUri: params.redirectUri,
    state
  });
}

export default async function KakaoLogin() {
  try {
    await KakaoAuthorize({
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!
    });
  } catch (error) {
    console.error("Kakao login failed:", error);
  }
}