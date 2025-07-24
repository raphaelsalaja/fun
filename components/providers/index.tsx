"use client";

import { Toast } from "@base-ui-components/react/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastList } from "@/components/toast";
import styles from "./styles.module.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider timeout={4000} limit={1}>
        {children}
        <Toast.Portal>
          <Toast.Viewport className={styles.viewport}>
            <ToastList />
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>
    </QueryClientProvider>
  );
}
