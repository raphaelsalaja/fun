import type { Erc20AssetInfo } from "@funkit/api-base";
import { memo } from "react";
import { Check } from "@/components/icons";
import { TokenImage } from "../token-image";
import styles from "./styles.module.css";

interface TokenListProps {
  tokens: Erc20AssetInfo[];
  selectedToken: Erc20AssetInfo | undefined;
  onTokenSelect: (token: Erc20AssetInfo) => void;
}

export const TokenList = memo<TokenListProps>(
  ({ tokens, selectedToken, onTokenSelect }) => {
    return (
      <div className={styles.list}>
        {tokens.length === 0 ? (
          <div className={styles.empty}>No Tokens Found</div>
        ) : (
          tokens.map((token: Erc20AssetInfo) => {
            const isSelected =
              selectedToken?.symbol === token.symbol &&
              selectedToken?.chain === token.chain;

            return (
              <button
                key={`${token.symbol}-${token.chain}`}
                type="button"
                className={styles.item}
                onClick={() => onTokenSelect(token)}
                data-selected={isSelected}
                aria-pressed={isSelected}
              >
                <div className={styles.info}>
                  <TokenImage
                    width={20}
                    height={20}
                    className={styles.icon}
                    alt={`${token.symbol} icon`}
                    address={token?.address || ""}
                    chain={token?.chain || ""}
                  />
                  <div className={styles.details}>
                    <div className={styles.name}>{token.name}</div>
                  </div>
                </div>
                {isSelected && (
                  <Check className={styles.check} aria-hidden="true" />
                )}
              </button>
            );
          })
        )}
      </div>
    );
  },
);

TokenList.displayName = "TokenList";
