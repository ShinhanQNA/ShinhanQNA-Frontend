export default interface GeneralPost {
  postId: number;
  title: string;
  content: string;
  likes: number;
  date: string;
  status: "응답 대기" | "응답 완료";
  reportCount: number;
  warningStatus: "없음" | "경고" | "차단";
  writerEmail: string;
  imagePath: string;
}