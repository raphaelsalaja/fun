"use client";

import type { Erc20AssetInfo } from "@funkit/api-base";
import React from "react";
import { useGetAsset, useGetAssetPriceInfo } from "@/hooks/fun";
import { TOKENS } from "@/lib/tokens";

export interface PriceInfo {
  unitPrice: number;
  currency: string;
  lastUpdated: string;
}

export interface ConverterState {
  sourceToken: Erc20AssetInfo;
  targetToken: Erc20AssetInfo;
  sourceAmount: number;
  targetAmount: number;
  usdAmount: number;
  isLoading: boolean;
  hasError: boolean;
  currency: string;
  setSourceToken: (token: Erc20AssetInfo) => void;
  setTargetToken: (token: Erc20AssetInfo) => void;
  setSourceAmount: (amount: number) => void;
  setTargetAmount: (amount: number) => void;
  setUsdAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  swapTokens: () => void;
  sourceTokenInfo: Erc20AssetInfo | undefined;
  targetTokenInfo: Erc20AssetInfo | undefined;
  sourcePrice: PriceInfo | undefined;
  targetPrice: PriceInfo | undefined;
}

const ConverterContext = React.createContext<ConverterState | null>(null);

interface ConverterProviderProps {
  children: React.ReactNode;
  initialSourceToken?: Partial<Erc20AssetInfo>;
  initialTargetToken?: Partial<Erc20AssetInfo>;
  initialCurrency?: string;
}

export function ConverterProvider({
  children,
  initialSourceToken = { ...TOKENS[2] },
  initialTargetToken = { ...TOKENS[3] },
  initialCurrency = "USD",
}: ConverterProviderProps) {
  const [sourceToken, setSourceToken] =
    React.useState<Partial<Erc20AssetInfo>>(initialSourceToken);
  const [targetToken, setTargetToken] =
    React.useState<Partial<Erc20AssetInfo>>(initialTargetToken);
  const [sourceAmount, setSourceAmount] = React.useState<number>(0);
  const [targetAmount, setTargetAmount] = React.useState<number>(0);
  const [usdAmount, setUsdAmount] = React.useState<number>(0);
  const [currency, setCurrency] = React.useState<string>(initialCurrency);

  const {
    data: sourceTokenInfo,
    error: sourceInfoError,
    isLoading: sourceInfoLoading,
  } = useGetAsset(sourceToken.chain, sourceToken.symbol);

  const {
    data: targetTokenInfo,
    error: targetInfoError,
    isLoading: targetInfoLoading,
  } = useGetAsset(targetToken.chain, targetToken.symbol);

  const {
    data: sourcePrice,
    error: sourcePriceError,
    isLoading: sourcePriceLoading,
  } = useGetAssetPriceInfo(sourceTokenInfo?.chain, sourceTokenInfo?.address);

  const {
    data: targetPrice,
    error: targetPriceError,
    isLoading: targetPriceLoading,
  } = useGetAssetPriceInfo(targetTokenInfo?.chain, targetTokenInfo?.address);

  const isLoading = React.useMemo(() => {
    return (
      sourceInfoLoading ||
      targetInfoLoading ||
      sourcePriceLoading ||
      targetPriceLoading ||
      !sourcePrice ||
      !targetPrice
    );
  }, [
    sourceInfoLoading,
    targetInfoLoading,
    sourcePriceLoading,
    targetPriceLoading,
    sourcePrice,
    targetPrice,
  ]);

  const hasError = React.useMemo(() => {
    return Boolean(
      sourceInfoError ||
        targetInfoError ||
        sourcePriceError ||
        targetPriceError,
    );
  }, [sourceInfoError, targetInfoError, sourcePriceError, targetPriceError]);

  const handleSetSourceAmount = React.useCallback(
    (amount: number) => {
      setSourceAmount(amount);

      if (sourcePrice?.unitPrice) {
        const newUsdAmount = amount * sourcePrice.unitPrice;
        setUsdAmount(newUsdAmount);

        if (targetPrice?.unitPrice) {
          const newTargetAmount = newUsdAmount / targetPrice.unitPrice;
          setTargetAmount(newTargetAmount);
        }
      }
    },
    [sourcePrice?.unitPrice, targetPrice?.unitPrice],
  );

  const handleSetTargetAmount = React.useCallback(
    (amount: number) => {
      setTargetAmount(amount);

      if (targetPrice?.unitPrice) {
        const newUsdAmount = amount * targetPrice.unitPrice;
        setUsdAmount(newUsdAmount);

        if (sourcePrice?.unitPrice) {
          const newSourceAmount = newUsdAmount / sourcePrice.unitPrice;
          setSourceAmount(newSourceAmount);
        }
      }
    },
    [sourcePrice?.unitPrice, targetPrice?.unitPrice],
  );

  const handleSetUsdAmount = React.useCallback(
    (amount: number) => {
      setUsdAmount(amount);

      if (sourcePrice?.unitPrice) {
        const newSourceAmount = amount / sourcePrice.unitPrice;
        setSourceAmount(newSourceAmount);
      }

      if (targetPrice?.unitPrice) {
        const newTargetAmount = amount / targetPrice.unitPrice;
        setTargetAmount(newTargetAmount);
      }
    },
    [sourcePrice?.unitPrice, targetPrice?.unitPrice],
  );

  const swapTokens = React.useCallback(() => {
    const tempToken = sourceToken;
    setSourceToken(targetToken);
    setTargetToken(tempToken);

    const tempAmount = sourceAmount;
    setSourceAmount(targetAmount);
    setTargetAmount(tempAmount);
  }, [sourceToken, targetToken, sourceAmount, targetAmount]);

  React.useEffect(() => {
    if (sourcePrice?.unitPrice && targetPrice?.unitPrice && sourceAmount > 0) {
      const newUsdAmount = sourceAmount * sourcePrice.unitPrice;
      setUsdAmount(newUsdAmount);
      const newTargetAmount = newUsdAmount / targetPrice.unitPrice;
      setTargetAmount(newTargetAmount);
    }
  }, [sourcePrice?.unitPrice, targetPrice?.unitPrice, sourceAmount]);

  const contextValue: ConverterState = React.useMemo(
    () => ({
      sourceToken,
      targetToken,
      sourceAmount,
      targetAmount,
      usdAmount,
      currency,
      isLoading,
      hasError,
      setSourceToken,
      setTargetToken,
      setSourceAmount: handleSetSourceAmount,
      setTargetAmount: handleSetTargetAmount,
      setUsdAmount: handleSetUsdAmount,
      setCurrency,
      swapTokens,
      sourceTokenInfo,
      targetTokenInfo,
      sourcePrice,
      targetPrice,
    }),
    [
      sourceToken,
      targetToken,
      sourceAmount,
      targetAmount,
      usdAmount,
      currency,
      isLoading,
      hasError,
      handleSetSourceAmount,
      handleSetTargetAmount,
      handleSetUsdAmount,
      swapTokens,
      sourceTokenInfo,
      targetTokenInfo,
      sourcePrice,
      targetPrice,
    ],
  );

  return (
    <ConverterContext.Provider value={contextValue}>
      {children}
    </ConverterContext.Provider>
  );
}

export function useConverter(): ConverterState {
  const context = React.useContext(ConverterContext);

  if (!context) {
    throw new Error("useConverter must be used within a ConverterProvider");
  }

  return context;
}

export { ConverterContext };
