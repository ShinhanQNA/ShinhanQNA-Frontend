export default interface Report {
  reportId: Number;
  postId: Number;
  reporterEmail: string;
  reportReason: string;
  reportDate: Date;
  resolved: boolean;
  message?: string;
}