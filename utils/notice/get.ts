"use server";

import GetNoticeList from "./list";
import Notice from "@/types/notice";

export default async function GetNotice(
  noticeId: string
): Promise<
  Notice
> {
  const res = await GetNoticeList();

  const data = res.find(notice => notice.id === Number(noticeId));
  return data!;
}