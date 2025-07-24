import Icon from "@/components/Icon";
import type { ButtonProps } from "@/types/button";
import styles from "./button.module.css";

export default function Button(props: ButtonProps) {
  const {
    children,
    size = "medium",
    variant = "filled",
    disabled = false,
    iconName,
    iconOnly = false,
    className,
    onClick,
    ...rest
  } = props;

  const buttonClassName = [
    styles.button,
    styles[size],
    styles[variant],
    iconOnly ? styles.iconOnly : "",
    className,
  ]
    .join(" ")
    .trim();

  return (
    <button className={buttonClassName} disabled={disabled} onClick={onClick} {...rest}>
      {iconName && (
        <Icon
          name={iconName}
          size={20}
        />
      )}
      {!iconOnly && children}
    </button>
  );
}
