export default interface ActionProps {
  type: "post" | "notice" | "answer";
  id: string;
  isMine: boolean;
  title?: string;
  content?: string;
  imagePath?: string;
}