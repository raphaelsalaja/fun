import { memo } from "react";
import { Search } from "@/components/icons";
import styles from "./styles.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = memo<SearchInputProps>(({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.search}>
      <Search className={styles.icon} />
      <input
        type="text"
        value={value}
        aria-label={"Search"}
        placeholder={"Search"}
        onChange={handleChange}
        className={styles.input}
        autoComplete="off"
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
