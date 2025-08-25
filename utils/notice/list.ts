import NoticeList from "@/types/noticelist";

export default async function GetNoticeList(accessToken: string): Promise<NoticeList[]> {
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/notices`;
  if (!process.env.NEXT_PUBLIC_BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("fetch_failed");
  }

  const data: NoticeList[] = await res.json();
  return data;
}