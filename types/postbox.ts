export default interface PostBoxProps {
  type: "post" | "selected" | "notice" | "signup";
  isAdmin?: boolean;
  path?: string | string[];
  slug: number;
  title: string;
  content?: string;
  likes?: number;
  flags?: number;
  bans?: number;
  status?: "완료" | "응답 대기";
}