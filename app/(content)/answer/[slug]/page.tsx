import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetAnswer from "@/utils/answer/get";
import styles from "./page.module.css";

export default async function AnswerPost({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const answer = await GetAnswer(slug);

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {answer.title}
          </h1>
          <p className={styles.paragraph}>
            {answer.content}
          </p>
        </div>
        <Footer />
      </div>
    </main>
  );
}