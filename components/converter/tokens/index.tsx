import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useState } from "react";
import useMeasure from "react-use-measure";
import { blur, SPRING_CONFIG, scale } from "@/lib/animations";
import { useConverter } from "../provider";
import { NetworksDialog } from "./dialogs/networks";
import styles from "./styles.module.css";
import { TokenImage } from "./token-image";

interface TokenIconProps {
  tokenSymbol: string;
  token: Erc20AssetInfo | undefined;
  isLoading: boolean;
}

const TokenIcon = memo<TokenIconProps>(({ tokenSymbol, token, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.iconcontainer}>
        <div className={styles.loading} data-variant="icon" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div {...scale} key={tokenSymbol} className={styles.iconcontainer}>
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
  );
});

TokenIcon.displayName = "TokenIcon";

interface TokenLabelProps {
  tokenSymbol: string;
  isLoading: boolean;
}

const TokenLabel = memo<TokenLabelProps>(({ tokenSymbol, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.labelcontainer}>
        <div className={styles.loading} data-variant="label" />
      </div>
    );
  }

  return (
    <div className={styles.labelcontainer}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tokenSymbol} className={styles.label} {...blur}>
          {tokenSymbol}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

TokenLabel.displayName = "TokenLabel";

interface TokenContentProps {
  tokenSymbol: string;
  token: Erc20AssetInfo | undefined;
  isLoading: boolean;
}

const TokenContent = memo<TokenContentProps>(
  ({ tokenSymbol, token, isLoading }) => {
    return (
      <motion.div
        key={isLoading ? "loading" : "loaded"}
        className={styles.inner}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <TokenIcon
          tokenSymbol={tokenSymbol}
          token={token}
          isLoading={isLoading}
        />
        <TokenLabel tokenSymbol={tokenSymbol} isLoading={isLoading} />
      </motion.div>
    );
  },
);

TokenContent.displayName = "TokenContent";

interface TokenTriggerProps {
  tokenSymbol: string;
  token: Erc20AssetInfo | undefined;
  isLoading: boolean;
  label: string;
}

const TokenTrigger = memo<TokenTriggerProps>(
  ({ tokenSymbol, token, isLoading, label }) => {
    const [ref, bounds] = useMeasure();

    return (
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
            <AnimatePresence mode="wait" initial={false}>
              <TokenContent
                key={isLoading ? "loading" : "loaded"}
                tokenSymbol={tokenSymbol}
                token={token}
                isLoading={isLoading}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </BaseDialog.Trigger>
    );
  },
);

TokenTrigger.displayName = "TokenTrigger";

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
            <TokenTrigger
              tokenSymbol={tokenSymbol}
              token={token}
              isLoading={isLoading}
              label={label}
            />
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
