import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function NoticePost() {
  const notices = {
    id: 1,
    title: "첫 번째 게시글",
    content: "이것은 첫 번째 게시글의 내용입니다."
  };

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>{notices.title}</h1>
          <p className={styles.paragraph}>{notices.content}</p>
        </div>
        <Footer />
      </div>
    </main>
  );
}