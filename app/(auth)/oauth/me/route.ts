import { NextResponse, NextRequest } from "next/server";
import GetMe from "@/utils/user/get";

export async function GET(
  req: NextRequest
): Promise<
  NextResponse
> {
  try {
    const accessToken = req.headers.get("Authorization");
    if (!accessToken) {
      return NextResponse.json(
        { error: "no_access_token" },
        { status: 400 }
      );
    }

    const info = await GetMe(accessToken)

    return NextResponse.json(
      info, { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "internal_server_error" },
      { status: 500 }
    );
  }
}