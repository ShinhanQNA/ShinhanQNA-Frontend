"use server";

import { revalidatePath } from "next/cache";
import GetCookie from "../cookie/get";
import ThreeWeekStatus from "@/types/threeweekstatus";

export default async function SetStatus(
  groupId: Number,
  status: string
): Promise<
  ThreeWeekStatus
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/three-week-opinions/group/${groupId}/status`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("set_status_failed");

  const result = res.json();
  revalidatePath("/");
  return result;
}