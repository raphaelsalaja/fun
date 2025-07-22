import NumberFlow, { type Format } from "@number-flow/react";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

const format: Format = {
  style: "decimal",
  minimumIntegerDigits: 1,
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
  useGrouping: "auto",
  roundingPriority: "auto",
  trailingZeroDisplay: "auto",
};

export function SourceValue() {
  const { sourceAmount } = useConverter();

  return (
    <NumberFlow
      value={sourceAmount}
      className={styles.value}
      data-testid="source-value"
      format={{ ...format }}
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
      format={{ ...format }}
    />
  );
}
