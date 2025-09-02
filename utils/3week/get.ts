"use server";

import GetThreeWeekList from "./list";
import ThreeWeek from "@/types/threeweek";

export default async function GetThreeWeekPost(
  groupId: string,
  postId: string
): Promise<
  ThreeWeek
> {
  const res = await GetThreeWeekList(groupId, "date");

  const data = res.opinions.find(post => post.id === Number(postId));
  return data!;
}