"use server";

import GetCookie from "../cookie/get";

export default async function VerifyStudent(
  students: string,
  name: string,
  department: string,
  year: string,
  image: File | null
): Promise<
  void
> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/users/certify`;
  const stateUrl = `${process.env.BACKEND_BASE_URL}/users/me/status`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const formData = new FormData();
  formData.append("students", students ?? "");
  formData.append("name", name ?? "");
  formData.append("department", department ?? "");
  formData.append("year", year ?? "");
  formData.append("role", "학생");
  formData.append("studentCertified", "true");
  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData
  });
  if (!res.ok) throw new Error("failed_to_verify_student");

  const stateRes = await fetch(stateUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "가입 대기 중"
    }),
  });
  if (!stateRes.ok) throw new Error("failed_to_update_state");

  return res.json();
}