import Header from "@/components/Header";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import GetNoticeList from "@/utils/notice/list";
import styles from "./page.module.css";

export default async function Notice() {
  const notices = await GetNoticeList();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            공지사항
          </h1>
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