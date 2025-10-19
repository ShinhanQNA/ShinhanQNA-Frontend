"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import { useAdmin } from "@/context/admin";
import styles from "./page.module.css";

export default function Profile() {
  const { admin } = useAdmin();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {admin ? "관리자" : "프로필"}
          </h1>
          <div className={styles.profile}>
            {admin ? (
              <>
                <div className={styles.actions}>
                  <Link href="/verireq">
                    <Button
                      iconName="user-round-plus"
                      className={styles.button}
                    >
                      가입 요청 검토
                    </Button>
                  </Link>
                  <Link href="/report">
                    <Button
                      iconName="flag"
                      className={styles.button}
                    >
                      신고 검토
                    </Button>
                  </Link>
                  <Link href="/appeal">
                    <Button
                      iconName="ban"
                      className={styles.button}
                    >
                      이의 제기 검토
                    </Button>
                  </Link>
                </div>
                <div className={styles.actions}>
                  <Link href="/noticew">
                    <Button
                      variant="transparent"
                      iconName="panels-top-left"
                    >
                      공지사항 등록
                    </Button>
                  </Link>
                  <Button
                    variant="transparent"
                    iconName="log-out"
                    onClick={() => { window.location.href = "/oauth/logout"; }}
                  >
                    로그아웃
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                    onClick={() => { window.location.href = "/oauth/logout"; }}
                  >
                    로그아웃
                  </Button>
                  <Button
                    variant="transparent"
                    iconName="circle-slash"
                    onClick={() => { window.location.href = "/oauth/delete"; }}
                  >
                    회원 탈퇴
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}