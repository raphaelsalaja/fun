import styles from "./styles.module.css";

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Root({ ...props }: RootProps) {
  return <div className={styles.root} {...props} />;
}
