"use server";

import { cookies } from "next/headers";

export default async function SetCookie(key: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(key, value);
}