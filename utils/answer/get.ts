"use server";

import GetCookie from "../cookie/get";
import Answer from "@/types/answer";

export default async function GetAnswer(
  answerId: string
): Promise<
  Answer
> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/answers`;
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

  const json: Answer[] = await res.json();
  if (!json) throw new Error("invalid_response");

  const data = json.find((answer) => answer.id === Number(answerId));
  if (!data) throw new Error("answer_not_found");

  return data;
}