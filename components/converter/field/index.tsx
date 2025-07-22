import { useConverter } from "../provider";
import styles from "./styles.module.css";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Field({ ...props }: FieldProps) {
  const { sourceAmount, setSourceAmount } = useConverter();

  return (
    <div className={styles.field}>
      <input
        {...props}
        placeholder="0"
        className={styles.input}
        value={sourceAmount || ""}
        onChange={(e) => setSourceAmount(Number(e.target.value) || 0)}
      />
    </div>
  );
}
