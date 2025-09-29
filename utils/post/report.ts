"use server";

import GetCookie from "../cookie/get";
import Report from "@/types/report";

export default async function DoReport(
  postId: string,
  reason: string
): Promise<
  Report
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/boards/${postId}/report`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reportReason: reason })
  });

  if (res.status === 400) {
    const data = await res.json();
    return { ...data, message: "already_reported" };
  }

  if (!res.ok) throw new Error("internal_server_error");

  return res.json();
}