"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import DeletePost from "@/utils/post/delete";
import DoLike from "@/utils/post/like";
import ActionProps from "@/types/actions";
import styles from "./action.module.css";

export default function Action({
  postId,
  isMine,
}: ActionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // 삭제 관련 함수들
  const handleDeleteClick = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      // 서버 액션이 바로 리다이렉트해서 이 코드는 실행되지 않을 것임
      await DeletePost(postId);
    } catch (error) {
      setIsConfirmModalOpen(false);
      setIsDeleting(false);
      setError("게시물 삭제에 실패했습니다.");
      setIsErrorModalOpen(true);
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    // TODO: 수정 페이지로 이동 로직 구현
    console.log("Edit clicked for post:", postId);
  };

  // 신고 버튼 클릭 핸들러
  const handleReportClick = () => {
    // TODO: 신고 기능 구현
    console.log("Report clicked for post:", postId);
  };

  // 추천 버튼 클릭 핸들러
  const handleLikeClick = async () => {
    try {
      setIsLiking(true);
      await DoLike(postId);
      // 서버 액션에서 revalidatePath로 페이지가 새로고침됨
    } catch (error) {
      setError("추천 처리에 실패했습니다.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <>
      <div className={styles.actions}>
        {isMine ? (
          <>
            <Button
              size="small"
              variant="warn"
              iconName="trash"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
            <Button
              size="small"
              iconName="square-pen"
              className={styles.orange}
              onClick={handleEditClick}
            >
              수정
            </Button>
          </>
        ) : (
          <>
            <Button
              size="small"
              iconName="flag"
              className={styles.orange}
              onClick={handleReportClick}
            >
              신고
            </Button>
            <Button
              size="small"
              iconName="thumbs-up"
              onClick={handleLikeClick}
              disabled={isLiking}
            >
              {isLiking ? "처리중..." : "추천"}
            </Button>
          </>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="게시글 삭제 확인"
        actions={
          <>
            <Button
              size="small"
              onClick={closeConfirmModal}
              type="button"
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              size="small"
              variant="warn"
              onClick={handleDeleteConfirm}
              type="button"
              disabled={isDeleting}
            >
              삭제
            </Button>
          </>
        }
      >
        <p>이 게시글을 정말로 삭제하시겠습니까?</p>
        <p>삭제된 게시글은 복구할 수 없습니다.</p>
      </Modal>

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
    </>
  );
}