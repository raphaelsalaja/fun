import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";

import styles from "./styles.module.css";

interface CurrencyProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom";
}

/*
 * Currency will return a list of all currencies available in the world.
 */
export function Currency({ position = "top" }: CurrencyProps) {
  return (
    <div className={styles.dialog} data-position={position}>
      <BaseDialog.Root>
        <BaseDialog.Trigger className={styles.trigger}>
          <div className={styles.label}>View notifications</div>
        </BaseDialog.Trigger>
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.Backdrop} />
          <BaseDialog.Popup className={styles.Popup}>
            <BaseDialog.Title className={styles.Title}>
              Notifications
            </BaseDialog.Title>
            <BaseDialog.Description className={styles.Description}>
              You are all caught up. Good job!
            </BaseDialog.Description>
            <div className={styles.Actions}>
              <BaseDialog.Close className={styles.Button}>
                Close
              </BaseDialog.Close>
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </div>
  );
}
