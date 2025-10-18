import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Action from "@/components/Action";
import GetAnswer from "@/utils/answer/get";
import GetAdmin from "@/utils/admin/get";
import styles from "./page.module.css";

export default async function AnswerPost({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const answer = await GetAnswer(slug);

  const isAdmin = await GetAdmin();

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
          {isAdmin && (
            <Action
              type="answer"
              id={slug}
              isMine={isAdmin}
              title={answer.title}
              content={answer.content}
            />
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}