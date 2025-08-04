export interface PostBoxProps {
  type: "post" | "selected" | "notice" | "signup";
  isAdmin?: boolean;
  path?: string;
  slug: number;
  title: string;
  content?: string;
  likes?: number;
  flags?: number;
  bans?: number;
  opinions?: number;
  status?: "waiting" | "completed";
}