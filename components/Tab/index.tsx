"use client";

import { useRef, useEffect, useState } from "react";
import { TabProps } from "@/types/tab";
import styles from "./tab.module.css";

export default function Tab({ tabs, focusedTab, onTabClick }: TabProps) {
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    const focusedIndex = tabs.findIndex((tab) => tab === focusedTab);
    const focusedTabRef = tabRefs.current[focusedIndex];

    if (focusedTabRef) {
      setUnderlineStyle({
        left: focusedTabRef.offsetLeft,
        width: focusedTabRef.offsetWidth,
      });
    }
  }, [focusedTab, tabs]);

  return (
    <div className={styles.tab}>
      {tabs.map((tab, index) => (
        <div
          key={tab}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
          className={`${styles.item} ${
            focusedTab === tab ? styles.focused : ""
          }`}
          onClick={() => onTabClick(tab)}
        >
          {tab}
        </div>
      ))}
      <div className={styles.underline} style={underlineStyle} />
    </div>
  );
}