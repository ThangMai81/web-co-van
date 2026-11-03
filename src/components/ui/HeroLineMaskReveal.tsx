import type { ReactElement } from "react";
import styles from "./HeroLineMaskReveal.module.css";

export function HeroLineMaskReveal({
  children,
  releaseOverflowAfterReveal = false,
}: {
  children: ReactElement;
  releaseOverflowAfterReveal?: boolean;
}) {
  return (
    <div
      className={[
        styles.mask,
        releaseOverflowAfterReveal ? styles.releaseOverflowAfterReveal : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-hero-line-mask={
        releaseOverflowAfterReveal ? "release-overflow" : undefined
      }
    >
      {children}
    </div>
  );
}
