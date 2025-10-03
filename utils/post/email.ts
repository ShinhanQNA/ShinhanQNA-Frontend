"use server";

import GetCookie from "@/utils/cookie/get";

export default async function GetEmail(): Promise<
  string | null
> {
  const accessToken = await GetCookie("access_token");

  const parts = accessToken?.split(".");
  if (!parts || parts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch (error) {
    return null;
  }
}