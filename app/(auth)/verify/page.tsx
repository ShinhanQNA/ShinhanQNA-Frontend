"use client";

import { useState, useRef } from "react";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import VerifyStudent from "@/utils/user/vertify";
import SelectOption from "@/types/selectoption";
import styles from "./page.module.css";

export default function Verify() {
  const [students, setStudents] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<SelectOption | null>(null);
  const [year, setYear] = useState<SelectOption | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 학년 옵션들
  const yearOptions: SelectOption[] = [
    { value: "1", label: "1학년" },
    { value: "2", label: "2학년" },
    { value: "3", label: "3학년" },
    { value: "4", label: "4학년" },
    { value: "5", label: "5학년 이상" },
  ];

  // 학과 옵션들
  const departmentOptions: SelectOption[] = [
    { value: "소프트웨어융합학과", label: "소프트웨어융합학과" },
  ];

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    // 성공 시 메인 페이지로 리다이렉트
    window.location.href = "/";
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileToSubmit = fileInputRef.current?.files?.[0] || selectedFile || null;

    setError(null);

    const trimmedStudents = students.trim();
    const trimmedName = name.trim();

    const missingItems: string[] = [];

    if (!trimmedName) {
      missingItems.push("이름");
    }

    if (!trimmedStudents) {
      missingItems.push("학번");
    }

    if (!year?.value) {
      missingItems.push("학년");
    }

    if (!department?.value) {
      missingItems.push("학과");
    }

    if (!fileToSubmit) {
      missingItems.push("학생증 사진");
    }

    if (missingItems.length > 0) {
      setError(`다음 항목을 입력해주세요:\n• ${missingItems.join("\n• ")}`);
      setIsErrorModalOpen(true);
      return;
    }

    setPending(true);

    try {
      await VerifyStudent(
        trimmedStudents,
        trimmedName,
        department!.value,
        year!.value,
        fileToSubmit
      );
      
      setIsSuccessModalOpen(true);
    } catch (error) {
      setError("학생 인증에 실패했습니다.");
      setIsErrorModalOpen(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <main className={styles.page}>
        <div className={styles.aside}>
          <Logo type="text" size={204} />
        </div>
        <div className={styles.main}>
          <h1 className={styles.title}>학생 인증</h1>
          <form className={styles.content} onSubmit={handleSubmit}>
            <TextField
              label="이름"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              disabled={pending}
            />
            <div className={styles.students}>
              <TextField
                label="학번"
                type="number"
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                className={styles.input}
                disabled={pending}
              />
              <Select
                label="학년"
                options={yearOptions}
                value={year}
                onChange={setYear}
                className={styles.select}
              />
            </div>

            <Select
              label="학과"
              options={departmentOptions}
              value={department}
              onChange={setDepartment}
              className={styles.select}
            />

            <div className={styles.photo}>
              <label className={styles.label}>
                학생증 사진 {selectedFile ? "✓" : "(필수)"}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Button
                size="small"
                onClick={handleFileSelect}
                type="button"
                disabled={pending}
              >
                {selectedFile ? "다른 파일 선택" : "학생증 첨부"}
              </Button>
              
              {selectedFile && (
                <div className={styles.preview}>
                  <div className={styles.file}>
                    <span>✅ {selectedFile.name}</span>
                    <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <Button
                      size="small"
                      variant="transparent"
                      onClick={removeFile}
                      className={styles.remove}
                      disabled={pending}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              size="big"
              disabled={pending}
            >
              {pending ? "가입 요청 중..." : "가입 요청"}
            </Button>
          </form>
        </div>
      </main>

      {/* 에러 모달 */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
        title="오류"
        actions={
          <Button size="small" onClick={closeErrorModal}>
            확인
          </Button>
        }
      >
        <p>{error}</p>
      </Modal>

      {/* 성공 모달 */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        title="인증 요청 완료"
        actions={
          <Button size="small" onClick={closeSuccessModal}>
            확인
          </Button>
        }
      >
        <p>학생 인증 요청이 완료되었습니다.</p>
        <p>검토 완료 후 이용이 가능합니다.</p>
      </Modal>
    </>
  );
}