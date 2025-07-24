import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import { NETWORKS } from "@/lib/networks";
import { getChainLogo } from "@/lib/uniswap";
import { SearchInput } from "../../search";
import styles from "../styles.module.css";
import { TokensDialog } from "../tokens";

interface NetworksDialogProps {
  assets: Erc20AssetInfo[];
  onTokenSelect: (token: Erc20AssetInfo) => void;
}

export const NetworksDialog = memo<NetworksDialogProps>(
  ({ assets, onTokenSelect }) => {
    const [search, setSearch] = useState("");

    const results = useMemo(() => {
      if (!search.trim()) return NETWORKS;

      const query = search.toLowerCase();
      return NETWORKS.filter((network) =>
        network.name.toLowerCase().includes(query),
      );
    }, [search]);

    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup
          className={styles.popup}
          role="dialog"
          aria-label="Select network"
        >
          <SearchInput value={search} onChange={setSearch} />
          <div className={styles.list}>
            {results.length === 0 ? (
              <div className={styles.empty}>No Networks Found</div>
            ) : (
              results.map((network) => (
                <BaseDialog.Root key={network.chain}>
                  <BaseDialog.Trigger className={styles.item}>
                    <div className={styles.info}>
                      <div className={styles.icon}>
                        <Image
                          width={40}
                          height={40}
                          alt={`${network.name} icon`}
                          src={getChainLogo(network.icon)}
                          data-type="network"
                          unoptimized
                        />
                      </div>
                      <div className={styles.details}>
                        <div className={styles.name}>{network.name}</div>
                        <div className={styles.symbol}>
                          {network.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </BaseDialog.Trigger>
                  <TokensDialog
                    assets={assets}
                    chain={network.chain}
                    onTokenSelect={onTokenSelect}
                  />
                </BaseDialog.Root>
              ))
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    );
  },
);
