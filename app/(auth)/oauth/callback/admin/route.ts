import { NextResponse, NextRequest } from "next/server";
import LogInAdmin from "@/utils/admin/login";
import SaveJWT from "@/utils/oauth/save";
import HandleError from "@/utils/oauth/error";

export async function POST(
  req: NextRequest
): Promise<
  NextResponse
> {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const password = formData.get("password");

    if (typeof id !== "string" || typeof password !== "string" || !id || !password) {
      throw new Error("login_failed");
    }

    const adminToken = await LogInAdmin(id, password);

    await SaveJWT(adminToken);

    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set({
      name: "admin",
      value: "true",
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "lax",
      path: "/"
    });

    return res;
  } catch (error) {
    return HandleError(error, req.url);
  }
}

// 캐시 방지
export const dynamic = "force-dynamic";