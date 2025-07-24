import { useCallback, useEffect, useRef, useState } from "react";
import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

export function Field({ ...props }: CurrencyInputProps) {
  const { amount, setAmount } = useConverter();
  const [localValue, setLocalValue] = useState<string>("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastExternalUpdate = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (
      amount !== undefined &&
      !isUserTyping &&
      amount !== lastExternalUpdate.current
    ) {
      lastExternalUpdate.current = amount;
      setLocalValue(amount === 0 ? "" : amount.toString());
    }
  }, [amount, isUserTyping]);

  const handleValueChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || "";
      setLocalValue(newValue);
      setIsUserTyping(true);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const numericValue = newValue === "" ? 0 : Number(newValue) || 0;

        if (numericValue !== amount) {
          lastExternalUpdate.current = numericValue;
          setAmount(numericValue);
        }

        setIsUserTyping(false);
      }, 300);
    },
    [amount, setAmount],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.field}>
      <CurrencyInput
        {...props}
        min={0}
        prefix="$"
        decimalsLimit={2}
        className={styles.input}
        value={localValue}
        onValueChange={handleValueChange}
        placeholder="$0.00"
      />
    </div>
  );
}
