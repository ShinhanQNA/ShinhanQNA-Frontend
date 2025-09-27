"use server";

import Me from "@/types/me";

export default async function DeleteMe(
  token: string
): Promise<
  Me
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/users/me`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("failed_to_delete_user");

  return res.json();
}