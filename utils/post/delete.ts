"use server";

import { redirect } from "next/navigation";
import GetCookie from "../cookie/get";

export default async function DeletePost(
  postId: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/boards/${postId}`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("failed_to_delete_post");

  // 서버에서 바로 리다이렉트
  redirect("/");
}