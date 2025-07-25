import { Toast } from "@base-ui-components/react";
import { useCallback, useEffect, useRef, useState } from "react";
import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

export function Field({ ...props }: CurrencyInputProps) {
  const toastManager = Toast.useToastManager();
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

      if (numericValue > 999_999.99) {
        const existingToast = toastManager.toasts.find(
          (toast) => toast.title === "Toast created",
        );

        if (existingToast) {
          setIsUserTyping(false);
          return;
        }

        toastManager.add({
          description: "Amount cannot exceed $999,999.",
        });
        setIsUserTyping(false);
        return;
      }

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
    [amount, setAmount, toastManager],
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
