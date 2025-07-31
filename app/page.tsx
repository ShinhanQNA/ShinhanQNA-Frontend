"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Tab from "@/components/Tab";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Home() {
  // 탭 상태 관리
  // 기본적으로 "📣 말해봐요" 탭이 선택되어 있음
  const [tab, setTab] = useState("📣 말해봐요");
  const tabs = ["📣 말해봐요", "⭐️ 선정된 의견", "✅ 답변 왔어요"];

  const posts = [
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

  // 선택된 탭에 따라 다른 컴포넌트를 렌더링
  const m = tab === "📣 말해봐요" ? (
    <>
      {posts.map((post) => (
        <PostBox type="post" key={post.id} slug={post.id} title={post.title} content={post.content} />
      ))}
    </>
  ) : tab === "⭐️ 선정된 의견" ? (
    <>
      {posts.map((post) => (
        <PostBox type="opinion" key={post.id} slug={post.id} title={post.title} content={post.content} />
      ))}
    </>
  ) : (
    <>
      {posts.map((post) => (
        <PostBox type="notice" key={post.id} slug={post.id} title={post.title} content={post.content} />
      ))}
    </>
  );

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <Tab
            tabs={tabs}
            focusedTab={tab}
            onTabClick={setTab}
          />
          {m}
        </div>
        <Footer />
      </div>
    </main>
  );
}