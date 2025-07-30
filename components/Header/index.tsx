import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.desktop}>
        <Link href="/" className={styles.logo}>
          <Logo type="text" size={104} />
        </Link>
        <div className={styles.buttons}>
          <Link href="/write">
            <Button
              variant="linear"
              size="small"
              iconName="plus"
              children="새 게시글"
            />
          </Link>
          <Link href="/notice">
            <Button
              variant="linear"
              size="small"
              iconName="loud-speaker"
              children="공지사항"
            />
          </Link>
          <Link href="/profile">
            <Button
              variant="linear"
              size="small"
              iconName="user"
              children="프로필"
            />
          </Link>
        </div>
      </div>
      <div className={styles.mobile}>
        <Link href="/" className={styles.logo}>
          <Logo size={28} />
        </Link>
        <div className={styles.buttons}>
          <Link href="/write">
            <Button
              variant="linear"
              size="tiny"
              iconName="plus"
              iconOnly
            />
          </Link>
          <Link href="/notice">
            <Button
              variant="linear"
              size="tiny"
              iconName="loud-speaker"
              iconOnly
            />
          </Link>
          <Link href="/profile">
            <Button
              variant="linear"
              size="tiny"
              iconName="user"
              iconOnly
            />
          </Link>
        </div>
      </div>
    </header>
  )
}