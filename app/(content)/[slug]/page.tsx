import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import Action from "@/components/Action";
import GetCookie from "@/utils/cookie/get";
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

  const imageKey = post?.imagePath ? post.imagePath.split("/").pop() : null;

  const isMine = post?.writerEmail == await GetCookie("email");

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
          <div className={styles.info}>
            <div className={styles.detail}>
              <Icon
                name="thumbs-up"
                size={16}
              />
              {post.likes}
            </div>
          </div>
          <Action 
            postId={slug} 
            isMine={isMine}
          />
        </div>
        <Footer />
      </div>
    </main>
  );
}