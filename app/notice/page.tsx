"use client";

import Header from "@/components/Header";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Notice() {
  const notices = [
    {
      id: 1,
      title: "첫 번째 게시글",
      content: "이것은 첫 번째 게시글의 내용입니다.",
    },
    {
      id: 2,
      title: "두 번째 게시글",
      content: "이것은 두 번째 게시글의 내용입니다.",
    },
    {
      id: 3,
      title: "세 번째 게시글",
      content: "이것은 세 번째 게시글의 내용입니다.",
    },
  ];

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>공지사항</h1>
          {notices.map((notice) => (
            <PostBox
              type="notice"
              key={notice.id}
              slug={notice.id}
              title={notice.title}
              content={notice.content}
            />
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}