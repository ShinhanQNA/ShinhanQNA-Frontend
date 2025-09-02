"use server";

import GetAnswerList from "./list";
import Answer from "@/types/answer";

export default async function GetAnswer(
  answerId: string
): Promise<
  Answer
> {
  const res = await GetAnswerList();

  const data = res.find(answer => answer.id === Number(answerId));
  return data!;
}