import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import { blur, loading, SPRING_CONFIG } from "@/lib/animations";
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
                      <TokenImage
                        width={16}
                        height={16}
                        key={tokenSymbol}
                        className={styles.icon}
                        alt={`${tokenSymbol} icon`}
                        address={token?.address || ""}
                        chain={token?.chain || ""}
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
