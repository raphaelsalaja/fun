import Link from "next/link";
import { Logo } from "../icons";
import styles from "./styles.module.css";

export function Footer() {
  return (
    <Link
      href="https://fun.xyz"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fun.xyz - Challenge"
      className={styles.footer}
    >
      <Logo className={styles.logo} />
    </Link>
  );
}
