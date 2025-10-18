"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import DeletePost from "@/utils/post/delete";
import DeleteNotice from "@/utils/notice/delete";
import DeleteAnswer from "@/utils/answer/delete";
import AcceptStudent from "@/utils/verify/accept";
import DenyStudent from "@/utils/verify/deny";
import DoLike from "@/utils/post/like";
import DoReport from "@/utils/post/report";
import ActionProps from "@/types/actions";
import styles from "./action.module.css";

export default function Action({
  type,
  id,
  isMine,
  title = "",
  content = "",
  imagePath,
  email = "",
  userName = ""
}: ActionProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const router = useRouter();

  // 통합된 모달 관리
  const showErrorModal = (message: string) => {
    setError(message);
    setIsErrorModalOpen(true);
  };

  const showSuccessModal = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const showInfoModal = (message: string) => {
    setInfoMessage(message);
    setIsInfoModalOpen(true);
  };

  // 삭제 관련 함수들
  const handleDeleteClick = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReportReason("");
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage(null);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setInfoMessage(null);
  };

  const closeAcceptModal = () => {
    setIsAcceptModalOpen(false);
  };

  const closeDenyModal = () => {
    setIsDenyModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      if (type === "post") {
        await DeletePost(id);
      } else if (type === "notice") {
        await DeleteNotice(id);
      } else if (type === "answer") {
        await DeleteAnswer(id);
      }
    } catch (error) {
      closeConfirmModal();
      setIsDeleting(false);
      const itemName = type === "post" ? "게시물" : type === "notice" ? "공지사항" : "답변";
      showErrorModal(`${itemName} 삭제에 실패했습니다.`);
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    const params = new URLSearchParams({
      edit: id,
      title: title,
      content: content
    });
    
    if (imagePath && type === "post") {
      params.set('imagePath', imagePath);
    }
    
    const editPath = type === "post" ? "/write" : type === "notice" ? "/noticew" : "/answerw";
    router.push(`${editPath}?${params.toString()}`);
  };

  // 신고 버튼 클릭 핸들러
  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const handleReportConfirm = async () => {
    const trimmedReason = selectedReportReason.trim();
    if (!trimmedReason) {
      showErrorModal("신고 사유를 입력해주세요.");
      return;
    }

    if (trimmedReason.length < 5) {
      showErrorModal("신고 사유를 5자 이상 입력해주세요.");
      return;
    }

    try {
      setIsReporting(true);
      const res = await DoReport(id, trimmedReason);
      closeReportModal();
      if (res.message === "already_reported") {
        showInfoModal("이미 해당 게시글을 신고하셨습니다.");
      } else {
        showSuccessModal("신고가 접수되었습니다.");
      }
    } catch (error) {
      closeReportModal();
      showErrorModal("신고 처리에 실패했습니다.");
    } finally {
      setIsReporting(false);
    }
  };

  // 추천 버튼 클릭 핸들러
  const handleLikeClick = async () => {
    try {
      setIsLiking(true);
      await DoLike(id);
      // 서버 액션에서 revalidatePath로 페이지가 새로고침됨
    } catch (error) {
      showErrorModal("추천 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  };

  // 승인 버튼 클릭 핸들러
  const handleAcceptClick = () => {
    setIsAcceptModalOpen(true);
  };

  const handleAcceptConfirm = async () => {
    try {
      setIsAccepting(true);
      await AcceptStudent(email);
      // AcceptStudent 함수에서 redirect()가 호출되므로 별도 처리 불필요
    } catch (error) {
      closeAcceptModal();
      setIsAccepting(false);
      showErrorModal("학생 승인에 실패했습니다.");
    }
  };

  // 거절 버튼 클릭 핸들러
  const handleDenyClick = () => {
    setIsDenyModalOpen(true);
  };

  const handleDenyConfirm = async () => {
    try {
      setIsDenying(true);
      await DenyStudent(email);
      // DenyStudent 함수에서 redirect()가 호출되므로 별도 처리 불필요
    } catch (error) {
      closeDenyModal();
      setIsDenying(false);
      showErrorModal("학생 거절에 실패했습니다.");
    }
  };

  return (
    <>
      <div className={styles.actions}>
        {type === "verify" ? (
          <>
            <Button
              size="small"
              variant="warn"
              iconName="x"
              onClick={handleDenyClick}
              disabled={isDenying || isAccepting}
            >
              {isDenying ? "처리 중..." : "거절"}
            </Button>
            <Button
              size="small"
              iconName="check"
              className={styles.greeen}
              onClick={handleAcceptClick}
              disabled={isAccepting || isDenying}
            >
              {isAccepting ? "처리 중..." : "승인"}
            </Button>
          </>
        ) : isMine ? (
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
        ) : type === "post" ? (
          <>
            <Button
              size="small"
              iconName="flag"
              className={styles.orange}
              onClick={handleReportClick}
              disabled={isReporting}
            >
              {isReporting ? "신고 중..." : "신고"}
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
        ) : null}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title={`${type === "post" ? "게시글" : type === "notice" ? "공지사항" : "답변"} 삭제 확인`}
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
        <p>이 {type === "post" ? "게시글" : type === "notice" ? "공지사항" : "답변"}을 정말로 삭제하시겠습니까?</p>
        <p>삭제된 {type === "post" ? "게시글" : type === "notice" ? "공지사항" : "답변"}은 복구할 수 없습니다.</p>
      </Modal>

      {/* 신고 사유 선택 모달 (게시글만) */}
      {type === "post" && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={closeReportModal}
          title="게시글 신고"
          actions={
          <>
            <Button
              size="small"
              onClick={closeReportModal}
              type="button"
              disabled={isReporting}
            >
              취소
            </Button>
            <Button
              size="small"
              variant="warn"
              onClick={handleReportConfirm}
              type="button"
              disabled={isReporting || !selectedReportReason.trim()}
            >
              {isReporting ? "신고 중..." : "신고"}
            </Button>
          </>
        }
      >
        <p>신고 사유를 구체적으로 입력해주세요:</p>
        <textarea
          value={selectedReportReason}
          onChange={(e) => setSelectedReportReason(e.target.value)}
          placeholder="신고 사유를 상세히 작성해주세요..."
          maxLength={500}
          rows={4}
          className={styles.textarea}
        />
        <p
          className={styles.paragraph}
        >
          {selectedReportReason.length}/500자
        </p>
        </Modal>
      )}

      {/* 성공 모달 (게시글만) */}
      {type === "post" && (
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={closeSuccessModal}
          title="신고 완료"
          actions={
            <Button
            size="small"
            onClick={closeSuccessModal}
            type="button"
          >
            확인
          </Button>
        }
      >
        <p>{successMessage}</p>
        </Modal>
      )}

      {/* 정보 모달 (게시글만) */}
      {type === "post" && (
        <Modal
          isOpen={isInfoModalOpen}
          onClose={closeInfoModal}
          title="알림"
          actions={
            <Button
            size="small"
            onClick={closeInfoModal}
            type="button"
          >
            확인
          </Button>
        }
      >
        <p>{infoMessage}</p>
        </Modal>
      )}

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

      {/* 승인 확인 모달 (verify만) */}
      {type === "verify" && (
        <Modal
          isOpen={isAcceptModalOpen}
          onClose={closeAcceptModal}
          title="학생 승인 확인"
          actions={
            <>
              <Button
                variant="linear"
                size="small"
                type="button"
                onClick={closeAcceptModal}
                disabled={isAccepting}
              >
                취소
              </Button>
              <Button
                size="small"
                type="button"
                onClick={handleAcceptConfirm}
                disabled={isAccepting}
              >
                승인
              </Button>
            </>
          }
        >
          <p>{userName} 학생의 가입 요청을 승인하시겠습니까?</p>
          <p>승인 후 해당 학생은 정상적으로 서비스를 이용할 수 있습니다.</p>
        </Modal>
      )}

      {/* 거절 확인 모달 (verify만) */}
      {type === "verify" && (
        <Modal
          isOpen={isDenyModalOpen}
          onClose={closeDenyModal}
          title="학생 거절 확인"
          actions={
            <>
              <Button
                variant="linear"
                size="small"
                onClick={closeDenyModal}
                type="button"
                disabled={isDenying}
              >
                취소
              </Button>
              <Button
                size="small"
                onClick={handleDenyConfirm}
                type="button"
                disabled={isDenying}
              >
                거절
              </Button>
            </>
          }
        >
          <p>{userName} 학생의 가입 요청을 거절하시겠습니까?</p>
          <p>거절 후 해당 학생은 서비스를 이용할 수 없습니다.</p>
        </Modal>
      )}
    </>
  );
}