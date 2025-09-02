import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GetPost from "@/utils/post/get";
import styles from "./page.module.css";

export default async function Post({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const post = await GetPost(slug);

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {post.title}
          </h1>
          <p className={styles.paragraph}>
            {post.content}
          </p>
        </div>
        <Footer />
      </div>
    </main>
  );
}