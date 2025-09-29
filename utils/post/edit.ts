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
      Authorization: `Bearer ${accessToken}`,
      // Content-Type 헤더를 제거 - 브라우저가 multipart/form-data로 자동 설정
    },
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "게시물 수정에 실패했습니다.");
  }

  // 페이지 캐시 무효화
  revalidatePath(`/${postId}`);
  
  return res.json();
}