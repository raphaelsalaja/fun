import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { memo, useMemo, useState } from "react";
import { NETWORKS } from "@/lib/networks";
import { SearchInput } from "../../search-input";
import { NetworkImage } from "../../token-image";
import styles from "../styles.module.css";
import { TokensDialog } from "../tokens";

interface NetworksDialogProps {
  assets: Erc20AssetInfo[];
}

export const NetworksDialog = memo<NetworksDialogProps>(({ assets }) => {
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
              <BaseDialog.Root key={network.chainId}>
                <BaseDialog.Trigger className={styles.item}>
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <NetworkImage
                        width={16}
                        height={16}
                        key={network.name}
                        alt={`${network.name} icon`}
                        chain={network.icon || ""}
                      />
                    </div>
                    <div className={styles.details}>
                      <div className={styles.name}>{network.name}</div>
                    </div>
                  </div>
                </BaseDialog.Trigger>
                <TokensDialog assets={assets} chain={network.chainId} />
              </BaseDialog.Root>
            ))
          )}
        </div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
});
