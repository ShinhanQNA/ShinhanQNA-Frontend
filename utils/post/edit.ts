"use server";

import { revalidatePath } from "next/cache";
import GetCookie from "../cookie/get";

export default async function EditPost(
  formData: FormData,
  postId: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/boards/${postId}`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: formData
  });
  if (!res.ok) throw new Error("failed_to_edit_post");

  // 페이지 캐시 무효화
  revalidatePath(`/${postId}`);
  
  return res.json();
}