"use server";

import JWT from "@/types/token";
import JWTExchange from "@/types/exchange";

export default async function GetJWT({
  variant,
  token
}: JWTExchange): Promise<
  JWT
> {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/oauth/callback/${variant}`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Authorization": `${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("login_failed");

  const data = await res.json();
  if (!data.access_token || !data.refresh_token) throw new Error("token_not_found");

  return data;
}