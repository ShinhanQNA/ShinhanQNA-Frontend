import ThreeWeekList from "@/types/threeweeklist";

export default async function GetThreeWeekList(accessToken: string, groupId: string, sort: "date" | "likes"): Promise<ThreeWeekList> {
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/three-week-opinions/group/${groupId}?sort=${sort}`;
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

  const data: ThreeWeekList = await res.json();
  return data;
}