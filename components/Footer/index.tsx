import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Button
        iconName="dices"
        className={styles.button}
        children="랜덤 글 보기"
      />
      <div className={styles.ad}>
        배너 광고
      </div>
      <div className={styles.list}>
        <Button
          size="tiny"
          variant="transparent"
          children="개인정보처리방침"
          className={`${styles.link} ${styles.privacy}`}
        />
        <Button
          size="tiny"
          variant="transparent"
          children="이용약관"
          className={styles.link}
        />
        <Button
          size="tiny"
          variant="transparent"
          children="법적고지"
          className={styles.link}
        />
      </div>
    </footer>
  )
}