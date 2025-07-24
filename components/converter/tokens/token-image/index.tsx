import { motion } from "motion/react";
import { memo } from "react";
import { Image } from "@/components/image";
import { scale } from "@/lib/animations";
import { getChainLogo, getTokenLogo } from "@/lib/uniswap";
import styles from "./styles.module.css";

interface TokenImageProps {
  address: string;
  chain: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
}

export const TokenImage = memo<TokenImageProps>(
  ({ chain, address, alt, width, height }) => {
    const tokenFallback = (
      <div data-mask={true} className={styles.placeholder}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );

    return (
      <motion.div
        key={`${chain}-${address}`}
        {...scale}
        layout="position"
        className={styles.icon}
      >
        <Image
          width={width}
          height={height}
          className={styles.token}
          alt={alt}
          src={getTokenLogo(chain, address)}
          unoptimized
          data-mask={true}
          fallback={tokenFallback}
        />
        {chain && (
          <Image
            width={width}
            height={height}
            className={styles.network}
            alt={alt}
            src={getChainLogo(chain)}
            unoptimized
          />
        )}
      </motion.div>
    );
  },
);

TokenImage.displayName = "TokenImage";

interface NetworkImageProps {
  chain: string;
  alt: string;
  width: number;
  height: number;
}

export const NetworkImage = memo<NetworkImageProps>(
  ({ chain, alt, width, height }) => {
    const networkFallback = (
      <div className={styles.placeholder}>{chain.charAt(0).toUpperCase()}</div>
    );

    return (
      <motion.div {...scale} layout="position" className={styles.icon}>
        <Image
          width={width}
          height={height}
          className={styles.token}
          alt={alt}
          src={getChainLogo(chain)}
          unoptimized
          fallback={networkFallback}
        />
      </motion.div>
    );
  },
);

NetworkImage.displayName = "NetworkImage";
