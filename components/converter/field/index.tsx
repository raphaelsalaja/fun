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
      setIsUserTyping(true);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // If value is empty, set to empty string
      if (!newValue) {
        setLocalValue("");
        debounceRef.current = setTimeout(() => {
          lastExternalUpdate.current = 0;
          setAmount(0);
          setIsUserTyping(false);
        }, 300);
        return;
      }

      const numericValue = Number(newValue) || 0;

      // If value exceeds max, don't update local value and clamp the amount
      if (numericValue > 999_999) {
        debounceRef.current = setTimeout(() => {
          const clampedValue = 999_999;
          lastExternalUpdate.current = clampedValue;
          setAmount(clampedValue);
          setLocalValue(clampedValue.toString());
          setIsUserTyping(false);
        }, 300);
        return;
      }

      // Normal case - value is within limits
      setLocalValue(newValue);
      debounceRef.current = setTimeout(() => {
        const finalValue = Math.max(numericValue, 0);
        if (finalValue !== amount) {
          lastExternalUpdate.current = finalValue;
          setAmount(finalValue);
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
