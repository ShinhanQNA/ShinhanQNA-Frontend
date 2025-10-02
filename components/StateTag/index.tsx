import StateTagProps from "@/types/statetag";
import styles from "./statetag.module.css";

export default function StateTag({
  type,
  className
}: StateTagProps) {
  const stateTagClassName = [
    styles.statetag,
    styles[type],
    className,
  ]
    .join(" ")
    .trim();

  const text = type === "waiting" ? "대기" : "완료";

  return (
    <div className={stateTagClassName}>
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="5" fill="var(--theme-text-inverse)"/>
      </svg>
      <span>{text}</span>
    </div>
  );
}