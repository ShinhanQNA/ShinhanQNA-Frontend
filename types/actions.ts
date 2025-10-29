export default interface ActionProps {
  type: "post" | "notice" | "answer" | "verify" | "appeal";
  id: string;
  isMine: boolean;
  title?: string;
  content?: string;
  imagePath?: string;
  email?: string;
  userName?: string;
}