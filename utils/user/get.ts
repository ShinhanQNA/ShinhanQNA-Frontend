"use server";

import GetCookie from "../cookie/get";
import Me from "@/types/me";

export default async function GetMe(): Promise<
  Me
> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/me`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("failed_to_fetch_user");

  return res.json();
}