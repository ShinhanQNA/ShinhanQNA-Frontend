import AnswerList from "@/types/answerlist";

export default async function GetAnswerList(accessToken: string): Promise<AnswerList[]> {
  if (!accessToken) {
    throw new Error("unauthorized");
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/answers`;
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

  const data: AnswerList[] = await res.json();
  return data;
}