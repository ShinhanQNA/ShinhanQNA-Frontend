"use server";

import GetCookie from "../cookie/get";

export default async function GetAdmin(): Promise<
  boolean
> {
  const accessToken = await GetCookie("access_token");

  const parts = accessToken?.split(".");
  if (!parts || parts.length !== 3) {
    return false;
  }

  let data;
  try {
    const payload = JSON.parse(atob(parts[1]));
    data = payload;
  } catch (error) {
    return false;
  }

  if (data.role === "ADMIN") {
    return true;
  } else {
    return false;
  }
}