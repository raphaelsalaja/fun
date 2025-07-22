import { SwapArrow } from "@/components/icons";
import styles from "./styles.module.css";

interface SwapProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function Swap({ ...props }: SwapProps) {
  return (
    <div className={styles.swap}>
      <button {...props} className={styles.button}>
        <SwapArrow className={styles.icon} />
      </button>
    </div>
  );
}
