import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextField from "@/components/TextField";
import Action from "@/components/Action";
import GetVerify from "@/utils/verify/get";
import styles from "./page.module.css";

export default async function StudentVerifyRequest({
  params
}: { params: Promise<{
  slug: string
}> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const user = await GetVerify(slug);

  const imageKey = user?.imagePath ? user.imagePath.split("/").pop() : null;

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
            <div className={styles.image}>
              <p className={styles.label}>
                재학 확인서 첨부 (학생증, 재학증명서)
              </p>
              <Image
                src={`/images/student-card/${imageKey}`}
                alt={`${user.name} 재학 확인서`}
                width={0}
                height={0}
                style={{ width: "100%", height: "auto" }}
                unoptimized
              />
            </div>
            <Action
              type="verify"
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