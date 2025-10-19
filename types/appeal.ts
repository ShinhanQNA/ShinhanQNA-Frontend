import Post from "./post";

export default interface Appeal {
  id: number;
  email: string;
  name: string;
  students: string;
  year: string;
  department: string;
  boards: Post[];
}