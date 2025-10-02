import TabProps from "@/types/tab";
import styles from "./tab.module.css";

export default function Tab({
  tabs,
  focusedTab,
  onTabClick
}: TabProps) {
  return (
    <div className={styles.tab}>
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`${styles.item} ${focusedTab === tab ? styles.focused : ""}`}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}