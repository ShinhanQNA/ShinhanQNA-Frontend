import ThreeWeek from "./threeweek";

export default interface ThreeWeekList {
  id: number;
  selectedYear: number;
  selectedMonth: number;
  responseStatus: "응답 대기" | "응답 완료";
  createdAt: string;
  opinions: ThreeWeek[];
}