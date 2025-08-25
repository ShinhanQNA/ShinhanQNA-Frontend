import { NextRequest, NextResponse } from "next/server";
import GetNotice from "@/utils/notice/get";

export async function GET(req: NextRequest) {
  // request-header로 access_token 받기
  const accessToken = req.headers.get("Authorization");
  const noticeId = req.nextUrl.searchParams.get("noticeId");

  if (!accessToken) {
    return NextResponse.json({ error: "no_access_token" }, { status: 401 });
  }

  if (!noticeId) {
    return NextResponse.json({ error: "no_notice_id" }, { status: 400 });
  }

  const notice = await GetNotice(accessToken, noticeId);
  return NextResponse.json(notice);
}