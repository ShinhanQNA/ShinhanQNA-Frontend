export default async function Reissue(refreshToken: string) {
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/token/reissue`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "refreshToken": refreshToken }),
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }
  
  try {
    const data = await res.json();
    if (!data?.access_token || !data?.refresh_token) return null;
    return data;
  } catch {
    return null;
  }
}