"use server";

import GetCookie from "../cookie/get";

export default async function VerifyStudent(
  students: number,
  name: string,
  department: string,
  year: number,
  role: string,
  image: File
): Promise<{ message: string }> {
  const backendUrl = `${process.env.BACKEND_BASE_URL}/users/certify`;
  if (!process.env.BACKEND_BASE_URL) throw new Error("server_misconfigured");

  const accessToken = await GetCookie("access_token");
  if (!accessToken) throw new Error("unauthorized");

  const formData = new FormData();
  formData.append("students", students.toString());
  formData.append("name", name);
  formData.append("department", department);
  formData.append("year", year.toString());
  formData.append("role", role);
  formData.append("studentCertified", "false");
  formData.append("image", image);

  const res = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "학생 인증에 실패했습니다.");
  }

  return res.json();
}