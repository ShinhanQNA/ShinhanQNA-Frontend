"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import { useAdmin } from "@/context/admin";
import styles from "./header.module.css";

export default function Header() {
  const { admin } = useAdmin();

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
            >
              {admin ? "새 답변" : "새 게시글"}
            </Button>
          </Link>
          <Link href="/notice">
            <Button
              variant="linear"
              size="small"
              iconName="loud-speaker"
            >
              공지사항
            </Button>
          </Link>
          <Link href="/profile">
            {admin ? (
              <Button
                variant="linear"
                size="small"
                iconName="shield-user"
              >
                관리자
              </Button>
            ) : (
              <Button
                variant="linear"
                size="small"
                iconName="user"
              >
                프로필
              </Button>
            )}
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