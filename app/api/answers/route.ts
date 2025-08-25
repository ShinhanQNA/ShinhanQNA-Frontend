import { NextRequest, NextResponse } from "next/server";
import GetAnswerList from "@/utils/answer/list";

export async function GET(req: NextRequest) {
  // request-header로 access_token 받기
  const accessToken = req.headers.get("Authorization");
  if (!accessToken) {
    return NextResponse.json({ error: "no_access_token" }, { status: 401 });
  }

  const posts = await GetAnswerList(accessToken);
  return NextResponse.json(posts);
}