import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import useMeasure from "react-use-measure";
import { blur, loading, SPRING_CONFIG, scale } from "@/lib/animations";
import { useConverter } from "../provider";
import { NetworksDialog } from "./dialogs/networks";
import styles from "./styles.module.css";
import { TokenImage } from "./token-image";

interface TokenSelectorProps {
  token: Erc20AssetInfo | undefined;
  onTokenSelect: (token: Erc20AssetInfo) => void;
  position: "top" | "bottom";
  label: string;
}

const TokenSelector = memo<TokenSelectorProps>(
  ({ token, onTokenSelect, position, label }) => {
    const { assets, isAssetsLoading } = useConverter();

    const [networkDialogOpen, setNetworkDialogOpen] = useState(false);
    const [ref, bounds] = useMeasure();

    const handleTokenSelect = useCallback(
      (selectedToken: Erc20AssetInfo) => {
        onTokenSelect(selectedToken);
        setNetworkDialogOpen(false);
      },
      [onTokenSelect],
    );

    const handleNetworkDialogOpenChange = useCallback((newOpen: boolean) => {
      setNetworkDialogOpen(newOpen);
    }, []);

    const tokenSymbol = token?.symbol || "";
    const isLoading = isAssetsLoading;

    return (
      <div data-position={position} className={styles.dialog}>
        <motion.div layout transition={SPRING_CONFIG}>
          <BaseDialog.Root
            open={networkDialogOpen}
            onOpenChange={handleNetworkDialogOpenChange}
          >
            <BaseDialog.Trigger
              className={styles.trigger}
              aria-label={`Select ${label} token`}
            >
              <motion.div
                className={styles.wrapper}
                animate={{ width: bounds.width || "auto" }}
                transition={SPRING_CONFIG}
              >
                <div ref={ref} className={styles.content}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        className={styles.inner}
                        {...loading}
                      >
                        <div className={styles.iconcontainer}>
                          <div className={styles.loading} data-variant="icon" />
                        </div>
                        <div className={styles.labelcontainer}>
                          <div
                            className={styles.loading}
                            data-variant="label"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="loaded"
                        className={styles.inner}
                        {...loading}
                      >
                        <AnimatePresence initial={false} mode="popLayout">
                          <motion.div
                            key={tokenSymbol}
                            {...scale}
                            layout="position"
                            className={styles.iconcontainer}
                          >
                            <TokenImage
                              width={16}
                              height={16}
                              className={styles.icon}
                              alt={`${tokenSymbol} icon`}
                              address={token?.address || ""}
                              chain={token?.chain || ""}
                            />
                          </motion.div>
                        </AnimatePresence>
                        <div className={styles.labelcontainer}>
                          <AnimatePresence initial={false} mode="popLayout">
                            <motion.div
                              key={tokenSymbol}
                              className={styles.label}
                              {...blur}
                            >
                              {tokenSymbol}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </BaseDialog.Trigger>
            <NetworksDialog
              assets={assets || []}
              onTokenSelect={handleTokenSelect}
            />
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
