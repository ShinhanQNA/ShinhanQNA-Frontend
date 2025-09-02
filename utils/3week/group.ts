"use server";

import GetCookie from "../cookie/get";
import ThreeWeekGroup from "@/types/threeweekgroup";

export default async function GetThreeWeekGroup(): Promise<
  ThreeWeekGroup[]
> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/three-week-opinions/groups/ids?year=${new Date().getFullYear()}`;
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
  return res.json();
}