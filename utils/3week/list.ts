"use server";

import GetCookie from "../cookie/get";
import ThreeWeekList from "@/types/threeweeklist";

export default async function GetThreeWeekList(
  groupId: string,
  sort: "date" | "likes"
): Promise<
  ThreeWeekList
> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/three-week-opinions/group/${groupId}?sort=${sort}`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized")

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("fetch_failed");

  const data = await res.json();
  if (!data) throw new Error("list_not_found");

  return data;
}