import ThreeWeekGroup from "@/types/threeweekgroup";

export default async function GetThreeWeekGroup(accessToken: string): Promise<ThreeWeekGroup[]> {
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/three-week-opinions/groups/ids?year=${new Date().getFullYear()}`;
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

  const data: ThreeWeekGroup[] = await res.json();
  return data;
}