import Link from "next/link";
import PostBoxProps from "@/types/postbox";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Statetag from "@/components/StateTag";
import SetStatus from "@/utils/3week/status";
import styles from "./postbox.module.css";

function Post({
  path = "",
  slug,
  title,
  content,
  likes,
  flags,
  bans,
  isAdmin
}: PostBoxProps) {
  return (
    <Link href={`${path}/${slug}`} className={styles.post}>
      <h3 className={styles.title}>
        {title}
      </h3>
      <p className={styles.content}>
        {content}
      </p>
      <div className={styles.status}>
        <div className={styles.likes}>
          <Icon name="thumbs-up" size={16} />
          <span>{likes}</span>
        </div>
        {isAdmin && flags != null && (
          <div className={styles.flags}>
            <Icon name="flag" size={16} color="var(--theme-accent-warning)" />
            <span>{flags}</span>
          </div>
        )}
        {isAdmin && bans != null && (
          <div className={styles.bans}>
            <Icon name="ban" size={16} color="var(--theme-accent-error)" />
            <span>{bans}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function Selected({
  path = "selected",
  slug,
  title,
  status,
  isAdmin
}: PostBoxProps) {
  return (
    <>
      <Link href={`${path}/${slug}`} className={styles.opinion}>
        <h3 className={styles.title}>
          {title}
        </h3>
        <Statetag type={status === "완료" ? "completed" : "waiting"} />
      </Link>
      {isAdmin && (
        <Select
          options={[
            { label: "대기", value: "응답 대기" },
            { label: "완료", value: "완료" }
          ]}
          value={{ label: "응답 상태", value: "응답 상태" }}
          onChange={(e) => SetStatus(Number(slug), e?.value!)}
          className={styles.select}
        />
      )}
    </>
  );
}

function Notice({
  path = "notice",
  slug,
  title,
  content
}: PostBoxProps) {
  return (
    <Link href={`${path}/${slug}`} className={styles.notice}>
      <h3 className={styles.title}>
        {title}
      </h3>
      <p className={styles.content}>
        {content}
      </p>
    </Link>
  );
}

function Signup({
  path = "verireq",
  slug,
  title,
  content
}: PostBoxProps) {
  return (
    <Link href={`${path}/${slug}`} className={styles.signup}>
      <h3 className={styles.title}>
        {title}
      </h3>
      <p className={styles.content}>
        {content}
      </p>
    </Link>
  );
}

export default function PostBox({
  type,
  isAdmin,
  ...rest
}: PostBoxProps) {
  const types = {
    post: Post,
    selected: Selected,
    notice: Notice,
    signup: Signup
  }
  const Content = types[type];
  if (!Content) return null;

  return (
    <div className={`${styles.postBox} ${isAdmin ? styles.admin : ""}`}>
      <Content
        type={type}
        isAdmin={isAdmin}
        {...rest}
      />
    </div>
  );
}