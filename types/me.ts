interface User {
  email: string;
  name: string;
  token: string;
  role: "학생" | null;
  year: string | null;
  department: string | null;
  studentCardImagePath: string | null;
  students: string | null;
  status: "가입 대기 중" | "가입 완료" | "가입 거절";
  studentCertified: boolean;
}

interface Warning {
  warningId: number;
  email: string;
  reason: string;
  warningDate: string;
  status: "경고" | "차단";
}

export default interface Me {
  user: User;
  warnings: Warning[];
}