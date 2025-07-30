export interface PostBoxProps {
  type: "post" | "opinion" | "notice" | "signup";
  isAdmin?: boolean;
  title: string;
  content?: string;
  likes?: number;
  flags?: number;
  bans?: number;
  opinions?: number;
  status?: "waiting" | "completed";
}