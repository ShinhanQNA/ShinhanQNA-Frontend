"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Profile() {
  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>프로필 페이지</h1>
          <div className={styles.profile}>
            <div className={styles.actions}>
              <Link href="/my-posts">
                <Button
                  variant="filled"
                  iconName="list"
                  className={styles.button}
                >
                  내 게시물
                </Button>
              </Link>
              <Link href="/coffee">
                <Button
                  variant="filled"
                  iconName="coffee"
                  className={styles.button}
                >
                  커피 사기
                </Button>
              </Link>
            </div>
            <div className={styles.actions}>
              <Button
                variant="transparent"
                iconName="log-out"
                onClick={() => {
                  // 로그아웃 로직을 여기에 추가 예정
                }}
              >
                로그아웃
              </Button>
              <Button
                variant="transparent"
                iconName="circle-slash"
                onClick={() => {
                  // 회원 탈퇴 로직을 여기에 추가 예정
                }}
              >
                회원 탈퇴
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}