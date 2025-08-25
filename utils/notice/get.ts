import Notice from "@/types/notice";

export default async function GetNotice(accessToken: string, noticeId: string): Promise<Notice> {
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

  const json: Notice[] = await res.json();
  if (!json) {
    throw new Error("fetch_failed");
  }

  const data = json.find((notice) => notice.id === Number(noticeId));
  if (!data) {
    throw new Error("not_found");
  }

  return data;
}