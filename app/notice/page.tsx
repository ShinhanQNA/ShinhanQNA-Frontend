import Header from "@/components/Header";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import GetCookie from "@/utils/cookie/get";
import NoticeList from "@/types/noticelist";
import styles from "./page.module.css";

export default async function Notice() {
  const accessToken = (await GetCookie("access_token")) || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notices`, {
    method: "GET",
    headers: {
      Authorization: accessToken
    }
  });

  const notices: NoticeList[] = await res.json();

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