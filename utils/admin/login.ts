"use server";

import JWT from "@/types/token";

export default async function LogInAdmin(
  id: string,
  password: string
): Promise<
  JWT
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/admin/login`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      password
    })
  });
  if (!res.ok) throw new Error("login_failed");

  return res.json();
}