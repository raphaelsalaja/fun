import { Toast } from "@base-ui-components/react";

import styles from "./styles.module.css";

export function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <div key={toast.id} style={{ position: "relative" }}>
      <div
        className={styles.blur}
        style={
          { "--toast-index": toasts.indexOf(toast) } as React.CSSProperties
        }
        data-fuck
      />
      <Toast.Root
        toast={toast}
        swipeDirection={["right", "left", "up"]}
        className={styles.toast}
      >
        <Toast.Title className={styles.title}>{toast.title}</Toast.Title>
        <Toast.Description className={styles.description} />
      </Toast.Root>
    </div>
  ));
}
