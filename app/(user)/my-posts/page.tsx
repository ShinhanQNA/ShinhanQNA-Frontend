import Header from "@/components/Header";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import GetMyPostList from "@/utils/post/mine";
import styles from "./page.module.css";

export default async function MyPosts() {
  const posts = await GetMyPostList();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            내 게시물
          </h1>
          {posts.map((post) => (
            <PostBox
              type="post"
              key={post.postId}
              slug={post.postId}
              title={post.title}
              content={post.content}
              likes={post.likes}
            />
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}