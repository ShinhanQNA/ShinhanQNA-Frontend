"use server";

import GetCookie from "../cookie/get";
import Me from "@/types/me";

export default async function GetMe(): Promise<
  Me
> {
  const accessToken = (await GetCookie("access_token")) || "";
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/me`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("fetch_failed");
  }

  const data: Me = await res.json();
  return data;
}