"use server";

import GetCookie from "../cookie/get";
import NoticeList from "@/types/noticelist";

export default async function GetNoticeList(): Promise<
  NoticeList[]
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/notices`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  return res.json();
}