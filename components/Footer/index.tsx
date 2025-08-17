import Link from "next/link";
import Button from "@/components/Button";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Button
        iconName="dices"
        className={styles.button}>
        랜덤 글 보기
      </Button>
      <div className={styles.ad}>
        배너 광고
      </div>
      <div className={styles.list}>
        <Link href="/privacy">
          <Button
            size="tiny"
            variant="transparent"
            className={`${styles.link} ${styles.privacy}`}
          >
            개인정보처리방침
          </Button>
        </Link>

        <Link href="/terms">
          <Button
            size="tiny"
            variant="transparent"
            className={styles.link}
          >
            이용약관
          </Button>
        </Link>

        <Link href="/license">
          <Button
            size="tiny"
            variant="transparent"
            className={styles.link}
          >
            법적고지
          </Button>
        </Link>
      </div>
    </footer>
  )
}