import Header from "@/components/Header";
import MainList from "@/components/MainList";
import Footer from "@/components/Footer";
import GetPostList from "@/utils/post/list";
import GetThreeWeekGroup from "@/utils/3week/group";
import GetAnswerList from "@/utils/answer/list";
import styles from "./page.module.css";

export default async function Home() {
  const posts = await GetPostList();
  const group = await GetThreeWeekGroup();
  const answers = await GetAnswerList();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <MainList
            posts={posts}
            group={group}
            answers={answers}
          />
        </div>
        <Footer />
      </div>
    </main>
  );
}