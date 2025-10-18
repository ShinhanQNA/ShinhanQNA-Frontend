"use server";

import { redirect } from "next/navigation";
import GetCookie from "../cookie/get";

export default async function DeleteAnswer(
  answerId: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/answers/${answerId}`;
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
  if (!res.ok) throw new Error("failed_to_delete_answer");

  // 서버에서 바로 리다이렉트
  redirect("/");
}