import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

export function Field({ ...props }: CurrencyInputProps) {
  const { amount, setAmount } = useConverter();

  return (
    <div className={styles.field}>
      <CurrencyInput
        {...props}
        placeholder="$0.00"
        prefix="$"
        decimalsLimit={2}
        className={styles.input}
        value={amount || ""}
        onValueChange={(value) => setAmount(Number(value) || 0)}
      />
    </div>
  );
}
