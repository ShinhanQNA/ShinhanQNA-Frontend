"use server";

import GetCookie from "../cookie/get";
import PostList from "@/types/postlist";

export default async function GetPostList(): Promise<
  PostList[]
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/boards`;
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
  return res.json();
}