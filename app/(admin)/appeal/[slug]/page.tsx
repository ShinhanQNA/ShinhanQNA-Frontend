import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextField from "@/components/TextField";
import Action from "@/components/Action";
import GetAppeal from "@/utils/appeal/get";
import styles from "./page.module.css";
import PostBox from "@/components/PostBox";

export default async function StudentVerifyRequest({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const user = await GetAppeal(slug);
  const posts = user.boards;

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            가입 요청
          </h1>
          <div className={styles.content}>
            <TextField
              label="이름"
              defaultValue={user.name}
              readOnly
            />
            <div className={styles.students}>
              <TextField
                label="학번"
                defaultValue={user.students}
                readOnly
                className={styles.student}
              />
              <TextField
                label="학년"
                defaultValue={user.year}
                readOnly
              />
            </div>
            <TextField
              label="학과"
              defaultValue={user.department}
              readOnly
            />
            {posts.map((post) => (
              <PostBox
                isAdmin={true}
                type="post"
                key={post.postId}
                slug={post.postId}
                title={post.title}
                content={post.content}
                likes={post.likes}
                flags={post.reportCount}
                bans={post.warningStatus === "경고" ? 1 : post.warningStatus === "차단" ? 2 : 0}
              />
            ))}
            <Action
              type="appeal"
              id={slug}
              isMine={false}
              email={user.email}
              userName={user.name}
            />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}