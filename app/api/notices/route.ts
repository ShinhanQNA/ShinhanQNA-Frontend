import { NextRequest, NextResponse } from "next/server";
import GetNoticeList from "@/utils/notice/list";

export async function GET(req: NextRequest) {
  // request-header로 access_token 받기
  const accessToken = req.headers.get("Authorization");
  if (!accessToken) {
    return NextResponse.json({ error: "no_access_token" }, { status: 401 });
  }

  const posts = await GetNoticeList(accessToken);
  return NextResponse.json(posts);
}