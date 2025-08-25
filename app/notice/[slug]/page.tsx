import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetCookie from "@/utils/cookie/get";
import Notice from "@/types/notice";
import styles from "./page.module.css";

export default async function NoticePost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return notFound();

  const accessToken = (await GetCookie("access_token")) || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notices/post?noticeId=${slug}`, {
    method: "GET",
    headers: {
      Authorization: accessToken
    }
  });

  if (!res.ok) return notFound();

  const notice: Notice = await res.json();

  if (!notice) return notFound();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>{notice.title}</h1>
          <p className={styles.paragraph}>{notice.content}</p>
        </div>
        <Footer />
      </div>
    </main>
  );
}