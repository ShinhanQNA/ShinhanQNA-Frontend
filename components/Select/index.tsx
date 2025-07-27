"use client";

import { useState, useRef, useEffect } from "react";
import type { SelectProps, SelectOption } from "@/types/select";
import styles from "./select.module.css";
import Icon from "@/components/Icon";

export default function Select({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  variant = "default",
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectClassName = [
    styles.select,
    styles[variant],
    className,
  ]
    .join(" ")
    .trim();

  return (
    <div className={selectClassName} ref={selectRef}>
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <span>{value ? value.label : placeholder}</span>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} />
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                value?.value === option.value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
