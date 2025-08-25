import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetCookie from "@/utils/cookie/get";
import Answer from "@/types/notice";
import styles from "./page.module.css";

export default async function AnswerPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return notFound();

  const accessToken = (await GetCookie("access_token")) || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/answers/post?answerId=${slug}`, {
    method: "GET",
    headers: {
      Authorization: accessToken
    }
  });

  if (!res.ok) return notFound();

  const answer: Answer = await res.json();

  if (!answer) return notFound();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>{answer.title}</h1>
          <p className={styles.paragraph}>{answer.content}</p>
        </div>
        <Footer />
      </div>
    </main>
  );
}