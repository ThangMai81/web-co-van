import type { ReactNode } from "react";
import { Reveal } from "@/components/animation/Reveal";
import styles from "./JourneyImageZoom.module.css";

/**
 * Khung ảnh banner trang Sứ mệnh. Hiệu ứng mở ảnh do CSS điều khiển theo
 * data-visible của Reveal — chạy một chiều, không bật ngược.
 */
export function JourneyImageZoom({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <Reveal direction="up">
      <div className={className}>
        <div className={styles.zoomFrame}>{children}</div>
      </div>
    </Reveal>
  );
}
