import styles from "./styles.module.css";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Stack({ ...props }: StackProps) {
  return <div className={styles.stack} {...props} />;
}
