
import Link from "next/link";
import { PostBoxProps } from "@/types/postbox";
import Icon from "@/components/Icon";
import Select from "@/components/Select";
import Statetag from "@/components/StateTag";
import styles from "./postbox.module.css";

export default function PostBox(props: PostBoxProps) {
  const { type, isAdmin, slug, title, content, likes, flags, bans, opinions, status } = props;

  if (type === "post") {
    return (
      <div className={`${styles.postBox} ${isAdmin ? styles.admin : ""}`}>
        <Link href={`/${slug}`} className={styles.post}>
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
      </div>
    );
  }

  if (type === "opinion") {
    return (
      <div className={`${styles.postBox} ${isAdmin ? styles.admin : ""}`}>
        <Link href={`/opinions/${slug}`} className={styles.opinion}>
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
      </div>
    );
  }

  if (type === "notice") {
    return (
      <div className={`${styles.postBox}`}>
        <Link href={`/notices/${slug}`} className={styles.notice}>
          <h3 className={styles.title}>
            {title}
          </h3>
          <p className={styles.content}>
            {content}
          </p>
        </Link>
      </div>
    );
  }

  if (type === "signup") {
    return (
      <div className={`${styles.postBox}`}>  
        <Link href={`/signupreqs/${slug}`} className={styles.signup}>
          <h3 className={styles.title}>
            {title}
          </h3>
          <p className={styles.content}>
            {content}
          </p>
        </Link>
      </div>
    );
  }
  return null;
}