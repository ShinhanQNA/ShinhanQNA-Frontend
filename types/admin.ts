export default interface Admin {
  id: string;
  password: string;
  role: "관리자";
  name: string;
  status: string;
  refreshToken: string;
}