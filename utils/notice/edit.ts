"use server";

import { revalidatePath } from "next/cache";
import GetCookie from "../cookie/get";

export default async function EditNotice(
  title: string,
  content: string,
  noticeId: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/notices/${noticeId}`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      title,
      content
    })
  });
  if (!res.ok) throw new Error("failed_to_edit_notice");

  // 페이지 캐시 무효화
  revalidatePath(`/notice/${noticeId}`);
  
  return res.json();
}