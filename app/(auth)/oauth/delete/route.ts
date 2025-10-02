import { NextResponse, NextRequest } from "next/server";
import { notFound } from "next/navigation";
import DeleteMe from "@/utils/user/delete";

export async function GET(
  req: NextRequest
): Promise<
  NextResponse
> {
  // 토큰 확인
  const token = req.cookies.get("access_token")?.value;
  
  // 백엔드에 로그아웃 요청 (토큰이 있을 때만)
  if (token) {
    try {
      await DeleteMe(token);
    } catch (error) {
      return notFound();
    }
  }
  
  // 모든 쿠키 삭제
  const res = NextResponse.redirect(new URL("/", req.url));
  for (const cookie of req.cookies.getAll()) {
    res.cookies.delete(cookie.name);
  }
  
  return res;
}