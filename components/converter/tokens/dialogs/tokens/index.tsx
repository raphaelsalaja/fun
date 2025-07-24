import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { memo, useMemo, useState } from "react";
import { SearchInput } from "../../search-input";
import { TokenImage } from "../../token-image";
import styles from "../styles.module.css";

interface TokensDialogProps {
  assets: Erc20AssetInfo[];
  chain: string;
}

export const TokensDialog = memo<TokensDialogProps>(({ chain, assets }) => {
  const tokens = useMemo(() => {
    return assets.filter((asset) => asset.chain === chain);
  }, [assets, chain]);

  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    if (!search.trim()) return tokens;
    const query = search.toLowerCase();
    return tokens.filter((token) => token.name.toLowerCase().includes(query));
  }, [search, tokens]);

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
            <div className={styles.empty}>No Tokens Found</div>
          ) : (
            results.map((token) => (
              <BaseDialog.Root key={token.chain}>
                <BaseDialog.Trigger className={styles.item}>
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <TokenImage
                        width={16}
                        height={16}
                        key={token.name}
                        className={styles.icon}
                        alt={`${token.name} icon`}
                        chain={token.chain || ""}
                        address={token.address}
                      />
                    </div>
                    <div className={styles.details}>
                      <div className={styles.name}>{token.name}</div>
                    </div>
                  </div>
                </BaseDialog.Trigger>
                <BaseDialog.Portal>
                  <BaseDialog.Popup className={styles.Popup}>
                    <BaseDialog.Title className={styles.Title}>
                      Customize notifications
                    </BaseDialog.Title>
                    <BaseDialog.Description className={styles.Description}>
                      Review your settings here.
                    </BaseDialog.Description>
                    <div className={styles.Actions}>
                      <BaseDialog.Close className={styles.Button}>
                        Close
                      </BaseDialog.Close>
                    </div>
                  </BaseDialog.Popup>
                </BaseDialog.Portal>
              </BaseDialog.Root>
            ))
          )}
        </div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
});
