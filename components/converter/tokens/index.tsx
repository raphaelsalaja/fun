import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useMemo, useState } from "react";
import { blur, loading, SPRING_CONFIG } from "@/lib/animations";
import { NETWORKS } from "@/lib/networks";
import { useConverter } from "../provider";
import { DialogHeader } from "./dialog-header";
import { NetworksDialog } from "./dialogs/networks";
import { type NetworkInfo, NetworkList } from "./network-list";
import { SearchInput } from "./search-input";
import styles from "./styles.module.css";
import { TokenImage } from "./token-image";
import { TokenList } from "./token-list";

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
    const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
    const [networkSearchQuery, setNetworkSearchQuery] = useState("");
    const [tokenSearchQuery, setTokenSearchQuery] = useState("");
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo | null>(
      null,
    );

    const handleNetworkKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          setNetworkDialogOpen(false);
          setNetworkSearchQuery("");
        }
      },
      [],
    );

    const handleTokenKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          setTokenDialogOpen(false);
          setTokenSearchQuery("");
        }
      },
      [],
    );

    const filteredNetworks = useMemo(() => {
      if (!networkSearchQuery.trim()) return NETWORKS;

      const query = networkSearchQuery.toLowerCase();
      return NETWORKS.filter((network) =>
        network.name.toLowerCase().includes(query),
      );
    }, [networkSearchQuery]);

    const networkTokens = useMemo(() => {
      if (!assets || !selectedNetwork) return [];

      return assets.filter(
        (asset) => Number(asset.chain) === selectedNetwork.chainId,
      );
    }, [assets, selectedNetwork]);

    console.log(assets);

    const filteredTokens = useMemo(() => {
      if (!tokenSearchQuery.trim()) return networkTokens;

      const query = tokenSearchQuery.toLowerCase();
      return networkTokens.filter(
        (asset: Erc20AssetInfo) =>
          asset.name?.toLowerCase().includes(query) ||
          asset.symbol?.toLowerCase().includes(query),
      );
    }, [networkTokens, tokenSearchQuery]);

    const handleNetworkSelect = useCallback((network: NetworkInfo) => {
      setSelectedNetwork(network);
      setNetworkDialogOpen(false);
      setNetworkSearchQuery("");
      setTokenDialogOpen(true);
    }, []);

    const handleTokenSelect = useCallback(
      (selectedToken: Erc20AssetInfo) => {
        onTokenSelect(selectedToken);
        setTokenDialogOpen(false);
        setTokenSearchQuery("");
        setSelectedNetwork(null);
      },
      [onTokenSelect],
    );

    const handleNetworkDialogOpenChange = useCallback((newOpen: boolean) => {
      setNetworkDialogOpen(newOpen);
      if (!newOpen) {
        setNetworkSearchQuery("");
      }
    }, []);

    const handleTokenDialogOpenChange = useCallback((newOpen: boolean) => {
      setTokenDialogOpen(newOpen);
      if (!newOpen) {
        setTokenSearchQuery("");
        setSelectedNetwork(null);
      }
    }, []);

    const handleBack = useCallback(() => {
      setTokenDialogOpen(false);
      setTokenSearchQuery("");
      setNetworkDialogOpen(true);
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
            <NetworksDialog assets={assets || []} />
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
