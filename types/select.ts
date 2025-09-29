import SelectOption from "./selectoption";

export default interface SelectProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption | null) => void;
  label?: string;
  placeholder?: string;
  variant?: "default" | "transparent";
  className?: string;
}