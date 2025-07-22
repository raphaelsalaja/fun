"use client";

import type { Erc20AssetInfo } from "@funkit/api-base";
import React from "react";
import { useGetAssetPriceInfo, useGetAssetsSimple } from "@/hooks/fun";

export interface PriceInfo {
  unitPrice: number;
  currency: string;
  lastUpdated: string;
}

export interface ConverterState {
  sourceToken: Erc20AssetInfo | undefined;
  targetToken: Erc20AssetInfo | undefined;
  sourceAmount: number;
  targetAmount: number;
  usdAmount: number;
  isLoading: boolean;
  hasError: boolean;
  currency: string;
  assets: Erc20AssetInfo[] | undefined;
  setSourceToken: (token: Erc20AssetInfo) => void;
  setTargetToken: (token: Erc20AssetInfo) => void;
  setSourceAmount: (amount: number) => void;
  setTargetAmount: (amount: number) => void;
  setUsdAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  swapTokens: () => void;
  sourcePrice: PriceInfo | undefined;
  targetPrice: PriceInfo | undefined;
}

const ConverterContext = React.createContext<ConverterState | null>(null);

interface ConverterProviderProps {
  children: React.ReactNode;
  initialCurrency?: string;
}

export function ConverterProvider({
  children,
  initialCurrency = "USD",
}: ConverterProviderProps) {
  const {
    data: assets,
    error: assetsError,
    isLoading: assetsLoading,
  } = useGetAssetsSimple();

  const [sourceToken, setSourceToken] = React.useState<
    Erc20AssetInfo | undefined
  >();
  const [targetToken, setTargetToken] = React.useState<
    Erc20AssetInfo | undefined
  >();
  const [sourceAmount, setSourceAmount] = React.useState<number>(0);
  const [targetAmount, setTargetAmount] = React.useState<number>(0);
  const [usdAmount, setUsdAmount] = React.useState<number>(0);
  const [currency, setCurrency] = React.useState<string>(initialCurrency);

  React.useEffect(() => {
    if (assets && assets.length >= 2 && !sourceToken && !targetToken) {
      setSourceToken(assets[0]);
      setTargetToken(assets[1]);
    }
  }, [assets, sourceToken, targetToken]);

  const {
    data: sourcePrice,
    error: sourcePriceError,
    isLoading: sourcePriceLoading,
  } = useGetAssetPriceInfo(sourceToken?.chain, sourceToken?.address || "");

  const {
    data: targetPrice,
    error: targetPriceError,
    isLoading: targetPriceLoading,
  } = useGetAssetPriceInfo(targetToken?.chain, targetToken?.address || "");

  const isLoading = React.useMemo(() => {
    return (
      assetsLoading ||
      sourcePriceLoading ||
      targetPriceLoading ||
      !sourcePrice ||
      !targetPrice ||
      !sourceToken ||
      !targetToken
    );
  }, [
    assetsLoading,
    sourcePriceLoading,
    targetPriceLoading,
    sourcePrice,
    targetPrice,
    sourceToken,
    targetToken,
  ]);

  const hasError = React.useMemo(() => {
    return Boolean(assetsError || sourcePriceError || targetPriceError);
  }, [assetsError, sourcePriceError, targetPriceError]);

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
  }, [sourceToken, targetToken]);

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
      assets,
      setSourceToken,
      setTargetToken,
      setSourceAmount: handleSetSourceAmount,
      setTargetAmount: handleSetTargetAmount,
      setUsdAmount: handleSetUsdAmount,
      setCurrency,
      swapTokens,
      sourcePrice: sourcePrice
        ? {
            unitPrice: sourcePrice.unitPrice,
            currency: currency,
            lastUpdated: new Date().toISOString(),
          }
        : undefined,
      targetPrice: targetPrice
        ? {
            unitPrice: targetPrice.unitPrice,
            currency: currency,
            lastUpdated: new Date().toISOString(),
          }
        : undefined,
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
      assets,
      handleSetSourceAmount,
      handleSetTargetAmount,
      handleSetUsdAmount,
      swapTokens,
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
