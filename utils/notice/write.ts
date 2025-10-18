"use server";

import GetCookie from "../cookie/get";

export default async function WriteNotice(
  title: string,
  content: string
) {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/notices`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token")
  if (!accessToken) throw new Error("unauthorized");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      title,
      content
    })
  });
  if (!res.ok) throw new Error("failed_to_write_notice");

  const data = await res.json();
  return data.id;
}