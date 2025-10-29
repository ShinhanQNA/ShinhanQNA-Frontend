"use server";

import { redirect } from "next/navigation";
import GetCookie from "../cookie/get";

export default async function AcceptAppeal(
  appealId: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/admin/appeals/${appealId}/status`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "승인"
    })
  });
  if (!res.ok) throw new Error("failed_to_accept_appeal");

  // 서버에서 바로 리다이렉트
  redirect("/verireq");
}