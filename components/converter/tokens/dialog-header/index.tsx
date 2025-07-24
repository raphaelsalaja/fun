import { memo } from "react";
import type { NetworkInfo } from "../network-list";
import { TokenImage } from "../token-image";
import styles from "./styles.module.css";

interface DialogHeaderProps {
  selectedNetwork: NetworkInfo;
  onBack: () => void;
}

export const DialogHeader = memo<DialogHeaderProps>(
  ({ selectedNetwork, onBack }) => {
    return (
      <div className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={onBack}
          aria-label="Back to network selection"
        >
          ← Back to Networks
        </button>
        <div className={styles.networkinfo}>
          <TokenImage
            width={16}
            height={16}
            key={selectedNetwork}
            className={styles.icon}
            alt={`${selectedNetwork} icon`}
            address={selectedNetwork?.address || ""}
            chain={selectedNetwork?.chain || ""}
          />
          <span>{selectedNetwork.name}</span>
        </div>
      </div>
    );
  },
);

DialogHeader.displayName = "DialogHeader";
