"use server";

import GetCookie from "../cookie/get";
import Like from "@/types/like";

export default async function DoLike(
  postId: string
): Promise<
  Like
> {
  const backendLikeUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/boards/${postId}/like`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendLikeUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status === 400) {
    const backendUnlikeUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/boards/${postId}/unlike`;

    const res = await fetch(backendUnlikeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    return res.json();
  }

  return res.json();
}