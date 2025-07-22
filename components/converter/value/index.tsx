import NumberFlow from "@number-flow/react";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

export function SourceValue() {
  const { amount } = useConverter();

  return (
    <NumberFlow
      value={amount}
      className={styles.value}
      data-testid="source-value"
    />
  );
}

export function TargetValue() {
  const { targetAmount } = useConverter();

  return (
    <NumberFlow
      value={targetAmount}
      className={styles.value}
      data-testid="target-value"
    />
  );
}
