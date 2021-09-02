// Imports
import styles from "@styles/components/CTA.module.scss";

// Types
import type { ReactElement } from "react";

/**
 * Call-to-action subheader
 * @param {string} title of CTA
 * @param {string} description of CTA
 * @returns {ReactElement} CTA
 */
export default function CTA({
  title,
  description,
}: {
  title: string;
  description: string;
}): ReactElement {
  return (
    <div className={styles.cta}>
      <div className={styles.cta__content}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
