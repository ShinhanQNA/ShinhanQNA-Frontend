export default interface ActionProps {
  type: "post" | "notice" | "answer" | "verify";
  id: string;
  isMine: boolean;
  title?: string;
  content?: string;
  imagePath?: string;
  email?: string;
  userName?: string;
}