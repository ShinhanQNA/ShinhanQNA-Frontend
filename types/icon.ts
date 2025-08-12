export type IconName =
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "ban"
  | "bell-ring"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "circle-slash"
  | "cloud-upload"
  | "coffee"
  | "dices"
  | "file-text"
  | "flag"
  | "funnel"
  | "globe"
  | "house"
  | "image"
  | "layout-panel-top"
  | "list"
  | "log-in"
  | "log-out"
  | "loud-speaker"
  | "mega-phone"
  | "menu"
  | "panels-top-left"
  | "plus"
  | "shield-user"
  | "square-pen"
  | "star"
  | "tablet-smartphone"
  | "thumbs-up"
  | "trash"
  | "user-round-plus"
  | "user"
  | "x";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}
