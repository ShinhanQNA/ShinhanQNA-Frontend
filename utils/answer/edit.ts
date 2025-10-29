"use server";

import { revalidatePath } from "next/cache";
import GetCookie from "../cookie/get";

export default async function EditAnswer(
  title: string,
  content: string,
  answerId: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/answers/${answerId}`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      content
    })
  });
  if (!res.ok) throw new Error("failed_to_edit_answer");

  // 페이지 캐시 무효화
  revalidatePath(`/answer/${answerId}`);
  
  return res.json();
}