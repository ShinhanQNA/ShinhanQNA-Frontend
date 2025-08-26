import ThreeWeek from "@/types/threeweek";
import ThreeWeekList from "@/types/threeweeklist";

export default async function GetThreeWeekPost(accessToken: string, groupId: string, postId: string): Promise<ThreeWeek> {
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/three-week-opinions/group/${groupId}`;
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

  const json: ThreeWeekList = await res.json();
  if (!json) {
    throw new Error("fetch_failed");
  }

  const data = json.opinions.find((post) => post.id === Number(postId));
  if (!data) {
    throw new Error("fetch_failed");
  }

  return data;
}