"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import WriteAnswer from "@/utils/answer/write";
import EditAnswer from "@/utils/answer/edit";
import styles from "./page.module.css";

export default function AnswerWrite() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 수정 모드 여부 확인
  const editPostId = searchParams?.get("edit");
  const isEditMode = !!editPostId;

  useEffect(() => {
    if (isEditMode) {
      const initialTitle = searchParams?.get("title");
      const initialContent = searchParams?.get("content");
      
      if (initialTitle) setTitle(decodeURIComponent(initialTitle));
      if (initialContent) setContent(decodeURIComponent(initialContent));
    } else {
      // 수정 모드가 아닐 때는 state 초기화
      setTitle("");
      setContent("");
    }
  }, [isEditMode, searchParams]);

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const showErrorModal = (message: string) => {
    setError(message);
    setIsErrorModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const titleValue = formData.get("title") as string;
    const contentValue = formData.get("content") as string;

    if (!titleValue?.trim()) {
      showErrorModal("제목을 입력해주세요.");
      return;
    }

    if (!contentValue?.trim()) {
      showErrorModal("내용을 입력해주세요.");
      return;
    }

    setPending(true);
    
    try {
      if (isEditMode) {
        // 수정 모드
        await EditAnswer(titleValue.trim(), contentValue.trim(), editPostId);
        router.push(`/answer/${editPostId}`);
      } else {
        // 작성 모드
        const answerId = await WriteAnswer(titleValue.trim(), contentValue.trim());
        router.push(`/answer/${answerId}`);
      }
    } catch (error) {
      showErrorModal(isEditMode ? "답변 수정에 실패했습니다." : "답변 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.headline}>
            {isEditMode ? "답변 수정" : "답변 작성"}
          </h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              id="title"
              name="title"
              className={`${styles.input} ${styles.title}`}
              aria-label="제목"
              placeholder="제목을 입력하세요"
              required
              disabled={pending}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              id="content"
              name="content"
              className={`${styles.input} ${styles.body}`}
              aria-label="내용"
              placeholder="내용을 입력하세요"
              required
              disabled={pending}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              size="small"
              iconName="cloud-upload"
              className={styles.fab}
              type="submit"
              disabled={pending}
            >
              {pending 
                ? (isEditMode ? "수정 중..." : "작성 중...") 
                : (isEditMode ? "수정하기" : "작성하기")
              }
            </Button>
          </form>
        </div>
        <Footer />
      </div>
      
      {/* 에러 모달 */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
        title="오류"
        actions={
          <Button
            size="small"
            onClick={closeErrorModal}
            type="button"
          >
            확인
          </Button>
        }
      >
        <p>{error}</p>
      </Modal>
    </main>
  );
}
