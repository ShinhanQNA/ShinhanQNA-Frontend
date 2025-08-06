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
                  children="내 게시물"
                />
              </Link>
              <Link href="/coffee">
                <Button
                  variant="filled"
                  iconName="coffee"
                  className={styles.button}
                  children="커피 사기"
                />
              </Link>
            </div>
            <div className={styles.actions}>
              <Button
                variant="transparent"
                iconName="log-out"
                children="로그아웃"
                onClick={() => {
                  // 로그아웃 로직을 여기에 추가 예정
                }}
              />
              <Button
                variant="transparent"
                iconName="circle-slash"
                children="회원 탈퇴"
                onClick={() => {
                  // 회원 탈퇴 로직을 여기에 추가 예정
                }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}