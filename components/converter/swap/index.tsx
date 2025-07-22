import { SwapArrow } from "@/components/icons";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

interface SwapProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function Swap({ ...props }: SwapProps) {
  const { swapTokens } = useConverter();

  return (
    <div className={styles.swap}>
      <button {...props} onClick={swapTokens} className={styles.button}>
        <SwapArrow className={styles.icon} />
      </button>
    </div>
  );
}
