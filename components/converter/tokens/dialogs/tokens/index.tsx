import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { motion } from "motion/react";
import { memo, useMemo, useState } from "react";
import { Image } from "@/components/image";
import { loading } from "@/lib/animations";
import { getTokenLogo } from "@/lib/uniswap";
import { SearchInput } from "../../search";
import styles from "../styles.module.css";

interface TokensDialogProps {
  assets: Erc20AssetInfo[];
  chain: string;
  onTokenSelect: (token: Erc20AssetInfo) => void;
}

export const TokensDialog = memo<TokensDialogProps>(
  ({ chain, assets, onTokenSelect }) => {
    const tokens = useMemo(() => {
      return assets.filter((asset) => String(asset.chain) === String(chain));
    }, [assets, chain]);

    const [search, setSearch] = useState("");

    const results = useMemo(() => {
      if (!search.trim()) return tokens;
      const query = search.toLowerCase();
      return tokens.filter(
        (token) =>
          token.name?.toLowerCase().includes(query) ||
          token.symbol?.toLowerCase().includes(query),
      );
    }, [search, tokens]);

    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup
          className={styles.popup}
          role="dialog"
          aria-label="Select token"
        >
          <SearchInput value={search} onChange={setSearch} />
          <div className={styles.list}>
            {results.length === 0 ? (
              <div className={styles.empty}>No Tokens Found</div>
            ) : (
              results.map((token) => (
                <BaseDialog.Close
                  key={`${token.chain}-${token.address}`}
                  type="button"
                  className={styles.item}
                  onClick={() => onTokenSelect(token)}
                >
                  <div className={styles.info}>
                    <div className={styles.icon}>
                      <Image
                        width={40}
                        height={40}
                        alt={`${token.name} icon`}
                        src={getTokenLogo(chain, token.address, token.symbol)}
                        fallback={
                          <motion.div
                            {...loading}
                            className={styles.placeholder}
                          >
                            {token.symbol?.charAt(0).toUpperCase()}
                          </motion.div>
                        }
                      />
                    </div>
                    <div className={styles.details}>
                      <div className={styles.name}>{token.name}</div>
                      <div className={styles.symbol}>
                        {token.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </BaseDialog.Close>
              ))
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    );
  },
);
