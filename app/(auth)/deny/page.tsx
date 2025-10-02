import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import styles from "./page.module.css";

export default function Deny() {
  return (
    <main className={styles.page}>
      <div className={styles.aside}>
        <Logo type="text" size={204} />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>가입 거절</h1>
        <p className={styles.content}>
          가입이 거절되었습니다.
        </p>
        <p className={styles.content}>
          다시 가입 신청 하시겠습니까?
        </p>
        <Link href="/verify">
          <Button
            size="small"
            variant="warn"
            iconName="refresh-ccw"
          >
            다시 신청하기
          </Button>
        </Link>
      </div>
    </main>
  );
}