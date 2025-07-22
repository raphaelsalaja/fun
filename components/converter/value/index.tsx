import NumberFlow from "@number-flow/react";

import styles from "./styles.module.css";

interface ValueProps extends React.ComponentProps<typeof NumberFlow> {}

export function Value({ ...props }: ValueProps) {
  return <NumberFlow {...props} className={styles.value} />;
}
