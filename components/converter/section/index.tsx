import styles from "./styles.module.css";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary";
}

export function Section({ variant = "primary", ...props }: SectionProps) {
  return <div className={styles.section} data-variant={variant} {...props} />;
}
