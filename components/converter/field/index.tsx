import styles from "./styles.module.css";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Field({ ...props }: FieldProps) {
  return (
    <div className={styles.field}>
      <input {...props} className={styles.input} placeholder="$0.00" />
    </div>
  );
}
