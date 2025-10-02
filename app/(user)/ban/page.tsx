import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import GetCookie from "@/utils/cookie/get";
import GetMe from "@/utils/user/get";
import styles from "./page.module.css";

export default async function Ban() {
  const accessToken = await GetCookie("access_token");
  const isBan = await GetCookie("status") === "차단";

  const warnings = (await GetMe(accessToken!)).warnings;
  const reason = warnings ? warnings.map(warning => warning.reason) : [];

  return (
    <main className={styles.page}>
      <div className={styles.aside}>
        <Logo type="text" size={204} />
      </div>
      <div className={styles.main}>
        {isBan ? (
          <>
            <h1 className={styles.title}>서비스 이용 제한 안내</h1>
            <p className={styles.content}>
              다음 사유로 인해 서비스 이용이 영구적으로 정지되었음을 알려드립니다.
            </p>
            {reason && reason.length > 0 && (
              reason.map((r, index) => (
                <p key={index} className={styles.content}>
                  {index + 1}. {r}
                </p>
              ))
            )}
            <p className={styles.content}>
              이 결정에 따라 회원님은 더 이상 본 계정으로 로그인하거나 서비스를 이용할 수 없습니다.
            </p>
            <Link href="/objection">
              <Button
                size="small"
                variant="warn"
                iconName="user"
              >
                이의 신청하기
              </Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className={styles.title}>의</h1>
            <p className={styles.content}>
              다음 사유로 인해 서비스 이용이 영구적으로 정지되었음을 알려드립니다.
            </p>
            
            <p className={styles.content}>
              이 결정에 따라 회원님은 더 이상 본 계정으로 로그인하거나 서비스를 이용할 수 없습니다.
            </p>
            <Link href="/objection">
              <Button
                size="small"
                variant="warn"
                iconName="user"
              >
                이의 신청하기
              </Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
}