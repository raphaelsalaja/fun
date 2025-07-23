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
  amount: number;
  isLoading: boolean;
  isAssetsLoading: boolean;
  isPriceLoading: boolean;
  hasError: boolean;
  assets: Erc20AssetInfo[] | undefined;
  setSourceToken: (token: Erc20AssetInfo) => void;
  setTargetToken: (token: Erc20AssetInfo) => void;
  setSourceAmount: (amount: number) => void;
  setTargetAmount: (amount: number) => void;
  setAmount: (amount: number) => void;
  swapTokens: () => void;
  sourcePrice: PriceInfo | undefined;
  targetPrice: PriceInfo | undefined;
}

const ConverterContext = React.createContext<ConverterState | null>(null);

interface ConverterProviderProps {
  children: React.ReactNode;
}

export function ConverterProvider({ children }: ConverterProviderProps) {
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
  const [amount, setAmount] = React.useState<number>(0);

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

  const isAssetsLoading = React.useMemo(() => {
    return assetsLoading || !assets;
  }, [assetsLoading, assets]);

  const isPriceLoading = React.useMemo(() => {
    return sourcePriceLoading || targetPriceLoading;
  }, [sourcePriceLoading, targetPriceLoading]);

  const isLoading = React.useMemo(() => {
    return (
      isAssetsLoading ||
      !sourcePrice ||
      !targetPrice ||
      !sourceToken ||
      !targetToken
    );
  }, [isAssetsLoading, sourcePrice, targetPrice, sourceToken, targetToken]);

  const hasError = React.useMemo(() => {
    return Boolean(assetsError || sourcePriceError || targetPriceError);
  }, [assetsError, sourcePriceError, targetPriceError]);

  const handleSetSourceAmount = React.useCallback(
    (amount: number) => {
      setSourceAmount(amount);

      if (sourcePrice?.unitPrice) {
        const newAmount = amount * sourcePrice.unitPrice;
        setAmount(newAmount);

        if (targetPrice?.unitPrice) {
          const newTargetAmount = newAmount / targetPrice.unitPrice;
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
        const newAmount = amount * targetPrice.unitPrice;
        setAmount(newAmount);

        if (sourcePrice?.unitPrice) {
          const newSourceAmount = newAmount / sourcePrice.unitPrice;
          setSourceAmount(newSourceAmount);
        }
      }
    },
    [sourcePrice?.unitPrice, targetPrice?.unitPrice],
  );

  const handleSetAmount = React.useCallback(
    (amount: number) => {
      setAmount(amount);

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
    const tempAmount = sourceAmount;
    setSourceToken(targetToken);
    setTargetToken(tempToken);
    setSourceAmount(targetAmount);
    setTargetAmount(tempAmount);
  }, [sourceToken, targetToken, sourceAmount, targetAmount]);

  React.useEffect(() => {
    if (sourcePrice?.unitPrice && targetPrice?.unitPrice && amount > 0) {
      const newSourceAmount = amount / sourcePrice.unitPrice;
      const newTargetAmount = amount / targetPrice.unitPrice;
      setSourceAmount(newSourceAmount);
      setTargetAmount(newTargetAmount);
    }
  }, [sourcePrice?.unitPrice, targetPrice?.unitPrice, amount]);

  const contextValue: ConverterState = React.useMemo(
    () => ({
      sourceToken,
      targetToken,
      sourceAmount,
      targetAmount,
      amount,
      isLoading,
      isAssetsLoading,
      isPriceLoading,
      hasError,
      assets,
      setSourceToken,
      setTargetToken,
      setSourceAmount: handleSetSourceAmount,
      setTargetAmount: handleSetTargetAmount,
      setAmount: handleSetAmount,
      swapTokens,
      sourcePrice: sourcePrice
        ? {
            unitPrice: sourcePrice.unitPrice,
            currency: "USD",
            lastUpdated: new Date().toISOString(),
          }
        : undefined,
      targetPrice: targetPrice
        ? {
            unitPrice: targetPrice.unitPrice,
            currency: "USD",
            lastUpdated: new Date().toISOString(),
          }
        : undefined,
    }),
    [
      sourceToken,
      targetToken,
      sourceAmount,
      targetAmount,
      amount,
      isLoading,
      isAssetsLoading,
      isPriceLoading,
      hasError,
      assets,
      handleSetSourceAmount,
      handleSetTargetAmount,
      handleSetAmount,
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
