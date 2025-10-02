import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header"
import Footer from "@/components/Footer";
import GetPost from "@/utils/post/get";
import styles from "./page.module.css";

export default async function SelectedPost({
  params
}: { params: Promise<{
  slug: string
  item: string
}> }) {
  const { slug, item } = await params;
  if (!slug || !item) return notFound();

  const post = await GetPost(slug);

  const imageKey = post?.imagePath ? post.imagePath.split("/").pop() : null;

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
          {post.imagePath && (
            <Image
              src={`/images/board-images/${imageKey}`}
              alt={`${post.title} 이미지`}
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              unoptimized
            />
          )}
        </div>
        <Footer />
      </div>
    </main>
  );
}