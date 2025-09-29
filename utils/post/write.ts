"use server";

import GetCookie from "../cookie/get";
import PostWrite from "@/types/postwrite";

export default async function WritePost({
  title,
  content,
  image
}: PostWrite) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/boards`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData
  });
  if (!res.ok) throw new Error("failed_to_write_post");

  const data = await res.json();
  return data.postId;
}