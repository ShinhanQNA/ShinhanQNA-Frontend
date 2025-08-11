import styles from "./icon.module.css";
import svgPath from "./icons.json";

import type { IconProps } from "@/types/icon";

export default function Icon({
  name,
  size = 24,
  color = "var(--theme-text-primary)",
  className
}: IconProps) {
  // 카카오톡 아이콘 여부 판별
  const isKakao = name === "kakaotalk";
  // mega-phone, loud-speaker 여부 판별
  const isSpeaker = name === "mega-phone" || name === "loud-speaker";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      // 카카오 아이콘은 정책상 채워진(fill) 상태여야 함
      fill={isKakao ? color : "none"}
      className={`${styles.icon} ${className ?? ""}`.trim()} // 스타일 및 추가 클래스 적용
    >
      {/* SVG path 데이터 적용, stroke는 color 사용 */}
      <path d={svgPath[name].path} stroke={isSpeaker ? "" : color} fill={isSpeaker ? color : ""} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}