import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import WritePost from "@/utils/post/write";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default function Write() {
  // Server Action: 폼 제출 처리
  const create = async (formData: FormData) => {
    "use server";
    const title = (formData.get("title") || "").toString().trim();
    const content = (formData.get("content") || "").toString().trim();

    if (!title || !content) {
      // 필수값 없으면 홈으로 되돌리기 (간단 처리)
      redirect("/");
    }

    const data = await WritePost({ title, content });

    // 생성된 게시글로 이동 시도, 실패 시 홈으로
    const id = data?.postId ?? data?.id ?? data?.post?.postId;
    if (typeof id === "number" || (typeof id === "string" && id.length > 0)) {
      redirect(`/${id}`);
    }
    redirect("/");
  };

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            게시글 작성
          </h1>
          <form className={styles.form} action={create}>
            <input
              id="title"
              name="title"
              className={`${styles.input} ${styles.titleInput}`}
              aria-label="제목"
              placeholder="제목을 입력하세요"
              required
            />
            <textarea
              id="content"
              name="content"
              className={`${styles.input} ${styles.contentInput}`}
              aria-label="내용"
              placeholder="정확한 전달을 위해 교수님 성함 혹은 과목명을 정확하게 기재해주세요."
              required
            />
            <Button
              size="small"
              iconName="file-text"
              type="button"
              onClick={() => {
                // 파일 업로드는 백엔드 스펙 확정 후 연결 예정
                // (현재 JSON API에 파일 전송 미지원)
              }}
            >
              첨부파일
            </Button>
            <div className={styles.instructions}>
              <p>
                주의사항 및 안내사항
              </p>
              <span>
                건전하고 유익한 커뮤니티 환경을 위해 다음 사항을 준수해주세요.
              </span>
              <ul>
                <br />
                <li>
                  특정 개인이나 단체에 대한 비방, 욕설, 혐오 발언 등 다른 사용자에게 불쾌감을 주는 게시물은 금지됩니다.
                </li>
                <br />
                <li>
                  본인 및 타인의 개인정보(이름, 연락처, 학번, 주소 등)를 무단으로 게시할 경우, 법적인 문제가 발생할 수 있습니다.
                </li>
                <br />
                <li>
                  확인되지 않은 허위사실을 유포하거나 타인의 명예를 훼손하는 내용은 작성할 수 없습니다.
                </li>
                <br />
                <li>
                  상업적 목적의 광고, 홍보성 게시물 및 도배성 게시물은 제재 대상이 될 수 있습니다.
                </li>
                <br />
                <li>
                  위의 사항에 위배되는 게시글은 사전 통보 없이 삭제될 수 있으며, 서비스 이용이 제한될 수 있습니다.
                </li>
                <br />
                <li>
                  게시글에 대한 법적 책임은 전적으로 작성자 본인에게 있습니다.
                </li>
              </ul>
            </div>
            <Button
              size="small"
              iconName="cloud-upload"
              className={styles.fab}
              type="submit"
            >
              작성하기
            </Button>
          </form>
        </div>
        <Footer />
      </div>
    </main>
  );
}
