import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import GetThreeWeekList from "@/utils/3week/list";
import styles from "./page.module.css";

export default async function Selected({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const data = await GetThreeWeekList(slug, "date");
  const year = data.selectedYear;
  const month = data.selectedMonth;

  const posts = data.opinions;

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {year}년 {month}월
          </h1>
          {posts.map((post) => (
            <PostBox
              type="post"
              key={post.id}
              path={slug}
              slug={post.id}
              title={post.title}
              content={post.content}
            />
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}