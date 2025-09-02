"use server";

import GetCookie from "../cookie/get";
import AnswerList from "@/types/answerlist";

export default async function GetAnswerList(): Promise<
  AnswerList[]
> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/answers`;
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