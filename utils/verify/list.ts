"use server";

import { notFound } from "next/navigation";
import GetCookie from "../cookie/get";
import VerifyList from "@/types/verifylist";

export default async function GetVerifyList(): Promise<
  VerifyList[]
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/admin/pending`;
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