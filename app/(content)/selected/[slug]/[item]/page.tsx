import { notFound } from "next/navigation";
import Header from "@/components/Header"
import Footer from "@/components/Footer";
import GetThreeWeekPost from "@/utils/3week/get";
import styles from "./page.module.css";

export default async function SelectedPost({
  params
}: { params: Promise<{
  slug: string
  item: string
}> }) {
  const { slug, item } = await params;
  if (!slug || !item) return notFound();

  const post = await GetThreeWeekPost(slug, item);

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {post.title}
          </h1>
          <p>
            {post.content}
          </p>
        </div>
        <Footer />
      </div>
    </main>
  );
}