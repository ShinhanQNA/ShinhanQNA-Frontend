import Like from "@/types/like";

export default async function DoLike(accessToken: string, postId: string): Promise<Like> {
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendLikeUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/boards/${postId}/like`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendLikeUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status === 400) {
    const backendUnlikeUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/boards/${postId}/unlike`;

    const res = await fetch(backendUnlikeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("unlike_failed");
    }

    const data: Like = await res.json();
    return data;
  }

  if (!res.ok) {
    throw new Error("like_failed");
  }

  const data: Like = await res.json();
  return data;
}