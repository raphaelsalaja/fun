import { useCallback, useEffect, useState } from "react";
import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

export function Field({ ...props }: CurrencyInputProps) {
  const { amount, setAmount } = useConverter();
  const [localValue, setLocalValue] = useState<string>("");

  useEffect(() => {
    if (amount !== undefined) {
      setLocalValue(amount.toString());
    }
  }, [amount]);

  useEffect(() => {
    if (localValue === "") {
      setAmount(0);
      return;
    }

    const timeoutId = setTimeout(() => {
      const numericValue = Number(localValue) || 0;
      if (numericValue !== amount) {
        setAmount(numericValue);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [localValue, setAmount, amount]);

  const handleValueChange = useCallback((value: string | undefined) => {
    setLocalValue(value || "");
  }, []);

  return (
    <div className={styles.field}>
      <CurrencyInput
        {...props}
        placeholder="$0.00"
        prefix="$"
        decimalsLimit={2}
        className={styles.input}
        value={localValue}
        onValueChange={handleValueChange}
      />
    </div>
  );
}
