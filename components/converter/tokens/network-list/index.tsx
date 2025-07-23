import Image from "next/image";
import { memo } from "react";
import styles from "./styles.module.css";

export interface NetworkInfo {
  chainId: number;
  name: string;
  icon: string;
}

interface NetworkListProps {
  networks: NetworkInfo[];
  onNetworkSelect: (network: NetworkInfo) => void;
}

export const NetworkList = memo<NetworkListProps>(
  ({ networks, onNetworkSelect }) => {
    return (
      <div className={styles.list}>
        {networks.length === 0 ? (
          <div className={styles.empty}>No Networks Found</div>
        ) : (
          networks.map((network) => (
            <button
              key={network.chainId}
              type="button"
              className={styles.item}
              onClick={() => onNetworkSelect(network)}
              aria-pressed={false}
            >
              <div className={styles.info}>
                <div className={styles.icon}>
                  <TokenImage
                    width={16}
                    height={16}
                    key={network}
                    className={styles.icon}
                    alt={`${network} icon`}
                    address={network?.address || ""}
                    chain={network?.chain || ""}
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.name}>{network.name}</div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    );
  },
);

NetworkList.displayName = "NetworkList";
