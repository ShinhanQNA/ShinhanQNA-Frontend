import Logo from "@/components/Logo";
import styles from "./page.module.css";

export default function Pending() {
  return (
    <main className={styles.page}>
      <div className={styles.aside}>
        <Logo type="text" size={204} />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>가입 대기 중</h1>
        <p className={styles.content}>
          가입 신청 내용을 안전하게 전달했어요.
        </p>
        <p className={styles.content}>
          관리자 확인까지 잠시 시간이 걸릴 수 있어요.
        </p>
      </div>
    </main>
  );
}