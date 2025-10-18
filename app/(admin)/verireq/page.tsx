import Header from "@/components/Header";
import PostBox from "@/components/PostBox";
import Footer from "@/components/Footer";
import GetVerifyList from "@/utils/verify/list";
import styles from "./page.module.css";

export default async function VerifyRequest() {
  const users = await GetVerifyList();

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            가입 요청
          </h1>
          {users.map((user) => (
            <PostBox
              type="signup"
              key={user.email}
              slug={user.email}
              title={`${user.students} ${user.name}`}
              content={`${user.department} ${user.year}학년`}
            />
          ))}
        </div>
        <Footer />
      </div>
    </main>
  );
}