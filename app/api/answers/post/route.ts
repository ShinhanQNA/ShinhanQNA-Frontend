import { NextRequest, NextResponse } from "next/server";
import GetAnswer from "@/utils/answer/get";

export async function GET(req: NextRequest) {
  // request-header로 access_token 받기
  const accessToken = req.headers.get("Authorization");
  const answerId = req.nextUrl.searchParams.get("answerId");

  if (!accessToken) {
    return NextResponse.json({ error: "no_access_token" }, { status: 401 });
  }

  if (!answerId) {
    return NextResponse.json({ error: "no_answer_id" }, { status: 400 });
  }

  const answer = await GetAnswer(accessToken, answerId);
  return NextResponse.json(answer);
}