import { memo } from "react";
import { Search } from "@/components/icons";
import styles from "./styles.module.css";

type DialogStep = "network" | "token";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  step: DialogStep;
}

export const SearchInput = memo<SearchInputProps>(
  ({ value, onChange, onKeyDown, step }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={styles.search}>
        <Search className={styles.icon} />
        <input
          type="text"
          placeholder={
            step === "network" ? "Search networks..." : "Search tokens..."
          }
          className={styles.input}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          aria-label={step === "network" ? "Search networks" : "Search tokens"}
          autoComplete="off"
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export type { DialogStep };
