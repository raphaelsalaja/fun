import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import { Check, Search } from "@/components/icons";
import { blur, loading, SPRING_CONFIG, scale } from "@/lib/animations";
import { useConverter } from "../provider";
import styles from "./styles.module.css";

interface TokenSelectorProps {
  token: Erc20AssetInfo | undefined;
  onTokenSelect: (token: Erc20AssetInfo) => void;
  position: "top" | "bottom";
  label: string;
}

const MotionImage = motion.create(Image);

const TokenImage = memo<{
  symbol: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}>(({ symbol, alt, className, width, height }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div
        className={`${styles.fallback} ${className}`}
        style={{ width, height }}
        title={alt}
      >
        {symbol.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      width={width}
      height={height}
      className={className}
      alt={alt}
      src={`/images/tokens/${symbol}.svg`}
      onError={handleError}
    />
  );
});

TokenImage.displayName = "TokenImage";

const TokenSelector = memo<TokenSelectorProps>(
  ({ token, onTokenSelect, position, label }) => {
    const { assets, isAssetsLoading } = useConverter();

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      },
      [],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          setOpen(false);
          setSearchQuery("");
        }
      },
      [],
    );

    const filteredTokens = useMemo(() => {
      if (!assets || !searchQuery.trim()) return assets;

      const query = searchQuery.toLowerCase();
      return assets.filter(
        (asset: Erc20AssetInfo) =>
          asset.name?.toLowerCase().includes(query) ||
          asset.symbol?.toLowerCase().includes(query),
      );
    }, [assets, searchQuery]);

    const handleTokenSelect = useCallback(
      (selectedToken: Erc20AssetInfo) => {
        onTokenSelect(selectedToken);
        setOpen(false);
        setSearchQuery("");
      },
      [onTokenSelect],
    );

    const tokenSymbol = token?.symbol || "";
    const isLoading = isAssetsLoading;

    return (
      <div data-position={position} className={styles.dialog}>
        <motion.div layout transition={SPRING_CONFIG}>
          <BaseDialog.Root open={open} onOpenChange={setOpen}>
            <BaseDialog.Trigger
              className={styles.trigger}
              aria-label={`Select ${label} token`}
            >
              <AnimatePresence initial={false} mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className={styles.content}
                    {...loading}
                  >
                    <div className={styles.loading} data-variant="icon" />
                    <div className={styles.loading} data-variant="label" />
                  </motion.div>
                ) : (
                  <motion.div
                    className={styles.content}
                    {...loading}
                    key="loaded"
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      <MotionImage
                        {...scale}
                        height={16}
                        width={16}
                        layout="position"
                        key={tokenSymbol}
                        className={styles.icon}
                        alt={`${tokenSymbol} icon`}
                        src={`/images/tokens/${tokenSymbol}.svg`}
                      />
                    </AnimatePresence>
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.div
                        {...blur}
                        layout="position"
                        key={`${tokenSymbol}-label`}
                        className={styles.label}
                      >
                        {tokenSymbol}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </BaseDialog.Trigger>
            <BaseDialog.Portal>
              <BaseDialog.Backdrop className={styles.backdrop} />
              <BaseDialog.Popup
                className={styles.popup}
                role="dialog"
                aria-label={`${label} token selector`}
              >
                <div className={styles.search}>
                  <Search className={styles.icon} />
                  <input
                    type="text"
                    placeholder="Search tokens..."
                    className={styles.input}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    aria-label="Search tokens"
                    autoComplete="off"
                  />
                </div>
                <div className={styles.list}>
                  {filteredTokens?.length === 0 ? (
                    <div className={styles.empty}>No Tokens Found</div>
                  ) : (
                    filteredTokens?.map((listToken: Erc20AssetInfo) => {
                      const isSelected = token?.symbol === listToken.symbol;
                      return (
                        <button
                          key={`${listToken.symbol}-${listToken.chain}`}
                          type="button"
                          className={styles.item}
                          onClick={() => handleTokenSelect(listToken)}
                          data-selected={isSelected}
                          aria-pressed={isSelected}
                        >
                          <div className={styles.info}>
                            <TokenImage
                              width={20}
                              height={20}
                              className={styles.icon}
                              alt={`${listToken.symbol} icon`}
                              symbol={listToken.symbol}
                            />
                            <div className={styles.name}>{listToken.name}</div>
                            <div className={styles.symbol}>
                              {listToken.symbol}
                            </div>
                          </div>
                          {isSelected && (
                            <Check
                              className={styles.check}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </BaseDialog.Popup>
            </BaseDialog.Portal>
          </BaseDialog.Root>
        </motion.div>
      </div>
    );
  },
);

TokenSelector.displayName = "TokenSelector";

export function SourceToken() {
  const { sourceToken, setSourceToken } = useConverter();

  return (
    <TokenSelector
      token={sourceToken}
      onTokenSelect={setSourceToken}
      position="top"
      label="source"
    />
  );
}

export function TargetToken() {
  const { targetToken, setTargetToken } = useConverter();

  return (
    <TokenSelector
      token={targetToken}
      onTokenSelect={setTargetToken}
      position="bottom"
      label="target"
    />
  );
}
