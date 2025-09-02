import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Privacy() {
  return (
    <main className={styles.page}>
      <Header />
      <div className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>개인정보 처리방침</h1>
          <h2 className={styles.subtitle}>1. 개인정보의 수집 및 이용 목적</h2>
          <p className={styles.paragraph}>본 방침은 당사가 수집하는 개인정보의 항목, 수집 및 이용 목적, 보유 및 이용 기간, 개인정보의 제3자 제공에 관한 사항을 포함합니다.</p>
          <h2 className={styles.subtitle}>2. 수집하는 개인정보의 항목</h2>
          <p className={styles.paragraph}>당사는 다음과 같은 개인정보를 수집합니다.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>이름</li>
            <li className={styles.listItem}>이메일 주소</li>
            <li className={styles.listItem}>학과</li>
            <li className={styles.listItem}>학번</li>
            <li className={styles.listItem}>학년</li>
          </ul>
          <h2 className={styles.subtitle}>3. 개인정보의 보유 및 이용 기간</h2>
          <p className={styles.paragraph}>당사는 수집한 개인정보를 이용 목적이 달성된 후에는 지체 없이 파기합니다.</p>
          <h2 className={styles.subtitle}>4. 개인정보의 제3자 제공</h2>
          <p className={styles.paragraph}>당사는 법령의 규정에 의한 경우를 제외하고는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
          <h2 className={styles.subtitle}>5. 개인정보 처리방침의 변경</h2>
          <p className={styles.paragraph}>당사는 개인정보 처리방침을 변경할 수 있으며, 변경 사항은 웹사이트에 게시됩니다.</p>
          <h2 className={styles.subtitle}>6. 개인정보 보호 책임자</h2>
          <p className={styles.paragraph}>당사는 개인정보 보호 책임자를 지정하여 개인정보 보호 업무를 수행하고 있습니다.</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>부서명: 마모키</li>
            <li className={styles.listItem}>이메일: privacy@shinhanqna.com</li>
          </ul>
        </div>
        <Footer />
      </div>
    </main>
  );
}