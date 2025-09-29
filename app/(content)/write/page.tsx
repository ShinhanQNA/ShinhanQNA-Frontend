"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import WritePost from "@/utils/post/write";
import EditPost from "@/utils/post/edit";
import styles from "./page.module.css";

export default function Write() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 수정 모드 여부 확인
  const editPostId = searchParams?.get("edit");
  const isEditMode = !!editPostId;

  useEffect(() => {
    if (isEditMode) {
      const initialTitle = searchParams?.get("title");
      const initialContent = searchParams?.get("content");
      const initialImagePath = searchParams?.get("imagePath");
      
      if (initialTitle) setTitle(decodeURIComponent(initialTitle));
      if (initialContent) setContent(decodeURIComponent(initialContent));
      if (initialImagePath) setExistingImagePath(initialImagePath);
    }
  }, [isEditMode, searchParams]);

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setPendingFile(null);
    // 파일 input 값 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confirmFileReplace = () => {
    if (pendingFile) {
      setSelectedFile(pendingFile);
      setPendingFile(null);
    }
    setIsConfirmModalOpen(false);
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
        const editFormData = new FormData();
        editFormData.append("title", titleValue.trim());
        editFormData.append("content", contentValue.trim());
        
        if (selectedFile) {
          // 새 파일이 선택된 경우
          editFormData.append("image", selectedFile);
        } else if (!existingImagePath) {
          // 기존 이미지가 삭제된 경우 (빈 파일로 처리)
          editFormData.append("removeImage", "true");
        }
        
        await EditPost(editFormData, editPostId);
        router.push(`/${editPostId}`);
      } else {
        // 작성 모드
        const postId = await WritePost({
          title: titleValue.trim(),
          content: contentValue.trim(),
          image: selectedFile || undefined
        });
        
        router.push(`/${postId}`);
      }
    } catch (error) {
      showErrorModal(isEditMode ? "게시글 수정에 실패했습니다." : "게시글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setPending(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // 파일이 선택되지 않았거나 여러 개 선택된 경우 처리
    if (!files || files.length === 0) {
      return;
    }
    
    if (files.length > 1) {
      showErrorModal("파일은 하나만 선택할 수 있습니다.");
      return;
    }
    
    const file = files[0];
    
    // 5MB 크기 제한
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showErrorModal("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }
    
    // 이미지 파일 타입 확인
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showErrorModal("지원되는 이미지 형식은 JPEG, PNG, GIF, WebP입니다.");
      return;
    }
    
    // 이미 파일이 선택된 경우 사용자에게 확인
    if (selectedFile) {
      setPendingFile(file);
      setIsConfirmModalOpen(true);
      return;
    }
    
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = () => {
    setExistingImagePath(null);
  };

  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.headline}>
            {isEditMode ? "게시글 수정" : "게시글 작성"}
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
              placeholder="정확한 전달을 위해 교수님 성함 혹은 과목명을 정확하게 기재해주세요."
              required
              disabled={pending}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              multiple={false}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            
            <Button
              size="small"
              iconName="file-text"
              onClick={handleFileSelect}
              type="button"
              disabled={pending}
            >
              {selectedFile ? "다른 파일 선택" : "첨부파일"}
            </Button>

            {/* 기존 이미지 미리보기 (수정 모드) */}
            {existingImagePath && !selectedFile && (
              <div className={styles.existingImagePreview}>
                <div className={styles.imageContainer}>
                  <Image
                    src={`/images/board-images/${existingImagePath.split('/').pop()}`}
                    alt="기존 이미지"
                    width={200}
                    height={150}
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <button 
                    type="button" 
                    onClick={removeExistingImage}
                    className={styles.removeFile}
                    disabled={pending}
                  >
                    ✕
                  </button>
                </div>
                <span>기존 이미지 (교체하려면 새 파일을 선택하세요)</span>
              </div>
            )}
            
            {/* 파일 미리보기 */}
            {selectedFile && (
              <div className={styles.filePreview}>
                <div className={styles.fileInfo}>
                  <span>{selectedFile.name}</span>
                  <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button 
                    type="button" 
                    onClick={removeFile}
                    className={styles.removeFile}
                    disabled={pending}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
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

      {/* 파일 교체 확인 모달 */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="파일 교체 확인"
        actions={
          <>
            <Button
              size="small"
              onClick={closeConfirmModal}
              type="button"
            >
              취소
            </Button>
            <Button
              size="small"
              variant="warn"
              onClick={confirmFileReplace}
              type="button"
            >
              교체
            </Button>
          </>
        }
      >
        <p>이미 선택된 파일이 있습니다. 새 파일로 교체하시겠습니까?</p>
      </Modal>
    </main>
  );
}
