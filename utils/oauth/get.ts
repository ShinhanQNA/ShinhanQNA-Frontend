import { BackendJWTRequest, BackendJWTResponse } from "@/types/jwt";

export default async function GetJWTToken({
  variant,
  token
}: BackendJWTRequest): Promise<BackendJWTResponse> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/oauth/callback/${variant}`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) {
    console.error("백엔드 서버 주소(BACKEND_BASE_URL)가 설정되지 않았습니다.");
    throw new Error("server_misconfigured");
  }

  // 1차 시도: 표준 Bearer 토큰 방식
  let response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Authorization": `${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error({
      status: response.status,
      body: await response.text(),
    });
    throw new Error(response.status === 401 ? "unauthorized" : "login_failed");
  }

  const data = await response.json();
  if (!data.access_token || !data.refresh_token) {
    console.error(data);
    throw new Error("login_failed");
  }

  return data;
}