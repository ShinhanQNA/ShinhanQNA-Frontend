import { NextRequest, NextResponse } from "next/server";
import GetThreeWeekPost from "@/utils/3week/get";

export async function GET(req: NextRequest) {
  // request-header로 access_token 받기
  const accessToken = req.headers.get("Authorization");
  const groupId = req.nextUrl.searchParams.get("groupId");
  const postId = req.nextUrl.searchParams.get("postId");

  if (!accessToken) {
    return NextResponse.json({ error: "no_access_token" }, { status: 401 });
  }

  if (!groupId) {
    return NextResponse.json({ error: "no_group_id" }, { status: 400 });
  }

  if (!postId) {
    return NextResponse.json({ error: "no_post_id" }, { status: 400 });
  }

  const answer = await GetThreeWeekPost(accessToken, groupId, postId);
  return NextResponse.json(answer);
}