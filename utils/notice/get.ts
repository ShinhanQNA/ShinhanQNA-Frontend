"use server";

import { notFound } from "next/navigation";
import GetCookie from "../cookie/get";
import Notice from "@/types/notice";

export default async function GetNotice(
  noticeId: string
): Promise<
  Notice
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/notices/${noticeId}`;
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
  if (!res.ok) return notFound();

  return res.json();
}