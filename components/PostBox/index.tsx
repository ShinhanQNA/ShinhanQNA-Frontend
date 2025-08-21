import Link from "next/link";
import { PostBoxProps } from "@/types/postbox";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Statetag from "@/components/StateTag";
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
    <>
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
      {isAdmin && (
        <Select
          className={styles.select}
          options={[]}
          value={null}
          onChange={() => {}}
          placeholder="응답 상태"
        />
      )}
    </>
  );
}

function Selected({
  path = "selected",
  slug,
  title,
  opinions,
  status,
  isAdmin
}: PostBoxProps) {
  return (
    <>
      <Link href={`${path}/${slug}`} className={styles.opinion}>
          <h3 className={styles.title}>
            {title}
          </h3>
          <p className={styles.content}>
            의견 {opinions}개
          </p>
          <Statetag type={status || "waiting"} />
        </Link>
        {isAdmin && (
          <Select
            className={styles.select}
            options={[]}
            value={null}
            onChange={() => {}}
            placeholder="응답 상태"
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
  path = "signupreqs",
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