import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Action from "@/components/Action";
import GetNotice from "@/utils/notice/get";
import GetAdmin from "@/utils/admin/get";
import styles from "./page.module.css";

export default async function NoticePost({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const notice = await GetNotice(slug);

  const isAdmin = await GetAdmin();

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
          {isAdmin && (
            <Action
              type="notice"
              id={slug}
              isMine={isAdmin}
              title={notice.title}
              content={notice.content}
            />
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}