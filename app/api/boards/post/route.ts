import { NextRequest, NextResponse } from "next/server";
import GetPost from "@/utils/post/post";

export async function GET(req: NextRequest) {
  // request-header로 access_token 받기
  const accessToken = req.headers.get("Authorization");
  const postId = req.nextUrl.searchParams.get("postId");

  if (!accessToken) {
    return NextResponse.json({ error: "no_access_token" }, { status: 401 });
  }

  if (!postId) {
    return NextResponse.json({ error: "no_post_id" }, { status: 400 });
  }

  const post = await GetPost(accessToken, postId);
  return NextResponse.json(post);
}