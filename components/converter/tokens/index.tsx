import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type { Erc20AssetInfo } from "@funkit/api-base";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useMemo, useState } from "react";
import { blur, loading, SPRING_CONFIG } from "@/lib/animations";
import { getChainIcon, getNetworkName } from "@/lib/tokens";
import { getChainLogo } from "@/lib/uniswap";
import { useConverter } from "../provider";
import { DialogHeader } from "./dialog-header";
import { type NetworkInfo, NetworkList } from "./network-list";
import { type DialogStep, SearchInput } from "./search-input";
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

    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [step, setStep] = useState<DialogStep>("network");
    const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo | null>(
      null,
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
          if (step === "token" && selectedNetwork) {
            setStep("network");
            setSelectedNetwork(null);
            setSearchQuery("");
          } else {
            setOpen(false);
            setSearchQuery("");
            setStep("network");
            setSelectedNetwork(null);
          }
        }
      },
      [step, selectedNetwork],
    );

    // Get unique networks from assets
    const availableNetworks = useMemo(() => {
      if (!assets) return [];

      const networkMap = new Map<number, NetworkInfo>();

      assets.forEach((asset) => {
        const chainId = Number(asset.chain);
        if (!networkMap.has(chainId)) {
          networkMap.set(chainId, {
            chainId,
            name: getNetworkName(chainId),
            icon: getChainLogo(getNetworkName(chainId)),
          });
        }
      });

      return Array.from(networkMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }, [assets]);

    // Filter networks by search query
    const filteredNetworks = useMemo(() => {
      if (!searchQuery.trim()) return availableNetworks;

      const query = searchQuery.toLowerCase();
      return availableNetworks.filter((network) =>
        network.name.toLowerCase().includes(query),
      );
    }, [availableNetworks, searchQuery]);

    // Get tokens for selected network
    const networkTokens = useMemo(() => {
      if (!assets || !selectedNetwork) return [];

      return assets.filter(
        (asset) => Number(asset.chain) === selectedNetwork.chainId,
      );
    }, [assets, selectedNetwork]);

    // Filter tokens by search query
    const filteredTokens = useMemo(() => {
      if (!searchQuery.trim()) return networkTokens;

      const query = searchQuery.toLowerCase();
      return networkTokens.filter(
        (asset: Erc20AssetInfo) =>
          asset.name?.toLowerCase().includes(query) ||
          asset.symbol?.toLowerCase().includes(query),
      );
    }, [networkTokens, searchQuery]);

    const handleNetworkSelect = useCallback((network: NetworkInfo) => {
      setSelectedNetwork(network);
      setStep("token");
      setSearchQuery("");
    }, []);

    const handleTokenSelect = useCallback(
      (selectedToken: Erc20AssetInfo) => {
        onTokenSelect(selectedToken);
        setOpen(false);
        setSearchQuery("");
        setStep("network");
        setSelectedNetwork(null);
      },
      [onTokenSelect],
    );

    const handleOpenChange = useCallback((newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSearchQuery("");
        setStep("network");
        setSelectedNetwork(null);
      }
    }, []);

    const handleBack = useCallback(() => {
      setStep("network");
      setSelectedNetwork(null);
      setSearchQuery("");
    }, []);

    const tokenSymbol = token?.symbol || "";
    const isLoading = isAssetsLoading;

    return (
      <div data-position={position} className={styles.dialog}>
        <motion.div layout transition={SPRING_CONFIG}>
          <BaseDialog.Root open={open} onOpenChange={handleOpenChange}>
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
                    <div className={styles.icongroup}>
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
                    </div>
                    <div className={styles.tokeninfo}>
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
                    </div>
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
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onKeyDown={handleKeyDown}
                  step={step}
                />

                {step === "network" && (
                  <NetworkList
                    networks={filteredNetworks}
                    onNetworkSelect={handleNetworkSelect}
                  />
                )}

                {step === "token" && selectedNetwork && (
                  <>
                    <DialogHeader
                      selectedNetwork={selectedNetwork}
                      onBack={handleBack}
                    />
                    <TokenList
                      tokens={filteredTokens}
                      selectedToken={token}
                      onTokenSelect={handleTokenSelect}
                    />
                  </>
                )}
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
