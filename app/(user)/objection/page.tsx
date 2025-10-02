"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import ObjectionStudent from "@/utils/user/objection";
import styles from "./page.module.css";

export default function Objection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [pending, setPending] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleObjection = async () => {
    setPending(true);
    try {
      const result = await ObjectionStudent();

      if ("message" in result && result.message === "이미 이의 제기 신청을 하셨습니다.") {
        setModalTitle("이미 접수됨");
        setModalContent("이미 이의 신청이 접수되었습니다.");
      } else {
        setModalTitle("이의 접수 완료");
        setModalContent(
          "이의 제기 신청이 완료되었습니다.\n운영팀에서 신속하게 검토를 진행할 수 있도록 하겠습니다.\n검토가 진행되는 동안에는 서비스 이용이 불가능하며, 이번 검토를 통해 내려진 결정은 최종적인 효력을 가집니다.\n기다려 주셔서 감사합니다."
        );
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("오류");
      setModalContent("이의 제기 신청 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.aside}>
        <Logo type="text" size={204} />
      </div>
      <div className={styles.main}>
        <h1 className={styles.title}>⚠️ 중요 안내</h1>
        <p className={styles.content}>
          이의 제기 신청은 마지막 기회입니다. 제출 이후에는 내용 수정이나 재신청이 절대 불가능합니다.
        </p>
        <p className={styles.content}>
          저희는 제출된 내용을 바탕으로 신중하게 재검토할 것이며, 이 과정에서 내려진 결정은 번복되지 않는 최종 조치임을 알려드립니다.
        </p>
        <Button
          size="small"
          iconName="plus"
          onClick={handleObjection}
          disabled={pending}
        >
          이의 접수하기
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        actions={
          <Button size="small" onClick={closeModal}>
            확인
          </Button>
        }
      >
        {modalContent.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </Modal>
    </main>
  );
}