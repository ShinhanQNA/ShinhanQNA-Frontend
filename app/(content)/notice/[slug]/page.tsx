import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetNotice from "@/utils/notice/get";
import styles from "./page.module.css";

export default async function NoticePost({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const notice = await GetNotice(slug);

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {notice.title}
          </h1>
          <p className={styles.paragraph}>
            {notice.content}
          </p>
        </div>
        <Footer />
      </div>
    </main>
  );
}