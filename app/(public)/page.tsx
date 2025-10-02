import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainList from "@/components/MainList";
import Button from "@/components/Button";
import GetCookie from "@/utils/cookie/get";
import GetPostList from "@/utils/post/list";
import GetThreeWeekGroup from "@/utils/3week/group";
import GetAnswerList from "@/utils/answer/list";
import styles from "./page.module.css";

export default async function Home() {
  const accessToken = await GetCookie("access_token");

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          {accessToken ?
            <MainList
              posts={await GetPostList()}
              group={await GetThreeWeekGroup()}
              answers={await GetAnswerList()}
            />
            :
            <div className={styles.message}>
              <p>로그인 시 모든 기능을 사용할 수 있어요.</p>
              <Link href="/login">
                <Button
                  size="small"
                  iconName="log-in"
                >
                  로그인
                </Button>
              </Link>
            </div>
          }
        </div>
        <Footer />
      </div>
    </main>
  );
}