import { AnimatePresence, motion } from "motion/react";
import NextImage from "next/image";
import React, { type ReactNode, useState } from "react";
import { loading } from "@/lib/animations";
import styles from "./styles.module.css";

interface ImageProps extends React.ComponentProps<typeof NextImage> {
  fallback?: ReactNode;
}

export function Image({ fallback, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  return (
    <React.Fragment>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div {...loading} className={styles.overlay}>
            <div className={styles.loader} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!isError ? (
          <NextImage
            {...props}
            onLoad={handleLoad}
            onError={handleError}
            unoptimized
          />
        ) : (
          fallback || (
            <motion.div {...loading} className={styles.error}>
              Image failed to load
            </motion.div>
          )
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
