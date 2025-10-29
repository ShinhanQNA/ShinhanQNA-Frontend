"use client";

import Logo from "@/components/Logo";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import styles from "./page.module.css";

export default function Login() {
  return (
    <main className={styles.page}>
      <div className={styles.aside}>
        <Logo
          type="text"
          size={204}
        />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>
          관리자 로그인
        </h1>
        <form
          className={styles.content}
          action="/oauth/callback/admin"
          method="POST"
        >
          <TextField
          label="아이디"
          type="text"
          name="id"
          className={styles.input}
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            className={styles.input}
          />
          <Button
            size="small"
          >
            로그인
          </Button>
        </form>
      </div>
    </main>
  );
}