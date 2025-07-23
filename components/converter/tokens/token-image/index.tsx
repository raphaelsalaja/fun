import { motion } from "motion/react";
import Image from "next/image";
import { memo } from "react";
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
    return (
      <motion.div {...scale} layout="position" className={styles.icon}>
        <Image
          width={width}
          height={height}
          className={styles.token}
          alt={alt}
          src={getTokenLogo(chain, address)}
          unoptimized
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
