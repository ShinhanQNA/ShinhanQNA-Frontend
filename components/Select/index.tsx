"use client";

import { useState, useRef, useEffect, useId } from "react";
import SelectProps from "@/types/select";
import SelectOption from "@/types/selectoption";
import styles from "./select.module.css";
import Icon from "@/components/Icon";

export default function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "선택하세요",
  variant = "default",
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const id = useId();

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
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)} id={id}>
        <span>
          {value ? value.label : placeholder}
        </span>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
        />
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
