"use server";

import { notFound } from "next/navigation";
import GetCookie from "../cookie/get";
import Objection from "@/types/objection";

export default async function ObjectionStudent(): Promise<
  Objection | { message: string }
> {
  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const backendUrl = `${process.env.BACKEND_BASE_URL}/appeals`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status == 400) return { message: "이미 이의 제기 신청을 하셨습니다." };

  if (!res.ok) return notFound();

  return res.json();
}