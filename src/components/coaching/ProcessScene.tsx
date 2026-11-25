import type { CSSProperties, ReactNode } from "react";
import styles from "./ProcessScene.module.css";

const IMAGE_W = 1448;
const IMAGE_H = 1086;

export const PROCESS_SCENE_IMAGES = [
  "/images/coaching/quy-trinh-buoc-01-minh-hoa-4x3.webp",
  "/images/coaching/quy-trinh-buoc-02-minh-hoa-4x3.webp",
  "/images/coaching/quy-trinh-buoc-03-minh-hoa-4x3.webp",
] as const;

function box(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    left: `${(x / IMAGE_W) * 100}%`,
    top: `${(y / IMAGE_H) * 100}%`,
    width: `${(w / IMAGE_W) * 100}%`,
    height: `${(h / IMAGE_H) * 100}%`,
  };
}

function point(x: number, y: number): CSSProperties {
  return { left: `${(x / IMAGE_W) * 100}%`, top: `${(y / IMAGE_H) * 100}%` };
}

/** Bản sao đúng vùng ảnh nền, dùng để phóng to thành phần giao diện khi con trỏ rê tới. */
function zoomBox(src: string, x: number, y: number, w: number, h: number): CSSProperties {
  const fw = w / IMAGE_W;
  const fh = h / IMAGE_H;
  return {
    ...box(x, y, w, h),
    backgroundImage: `url(${src})`,
    backgroundSize: `${100 / fw}% ${100 / fh}%`,
    backgroundPosition: `${((x / IMAGE_W) / (1 - fw)) * 100}% ${((y / IMAGE_H) / (1 - fh)) * 100}%`,
  };
}

function Zoom({
  src,
  rect,
  className,
  children,
}: {
  src: string;
  rect: readonly [number, number, number, number];
  className: string;
  children?: ReactNode;
}) {
  return (
    <span className={`${styles.zoom} ${className}`} style={zoomBox(src, ...rect)}>
      {children}
    </span>
  );
}

function Clock() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.clock}>
      <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4.6V8l2.3 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m3.5 8.4 2.9 2.8 6-6.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RequestScene() {
  const src = PROCESS_SCENE_IMAGES[0];
  return (
    <>
      <span className={styles.nameCover} style={box(694, 513, 108, 35)}>Coach</span>

      <Zoom src={src} rect={[908, 369, 277, 27]} className={styles.s1Field1Zoom}>
        <span className={`${styles.fieldInk} ${styles.s1Field1}`} style={{ left: "5%", top: "26%", width: "72%", height: "48%" }} />
      </Zoom>
      <Zoom src={src} rect={[902, 428, 278, 27]} className={styles.s1Field2Zoom}>
        <span className={`${styles.fieldInk} ${styles.s1Field2}`} style={{ left: "5%", top: "26%", width: "61%", height: "48%" }} />
      </Zoom>
      <Zoom src={src} rect={[884, 490, 292, 116]} className={styles.s1MessageZoom}>
        <span className={styles.messageCover} style={{ left: "2.7%", top: "6.9%", width: "94.5%", height: "84.5%" }}>
          <span className={`${styles.messageLine} ${styles.s1Line1}`} style={{ width: "86%" }} />
          <span className={`${styles.messageLine} ${styles.s1Line2}`} style={{ width: "72%" }} />
          <span className={`${styles.messageLine} ${styles.s1Line3}`} style={{ width: "48%" }} />
        </span>
      </Zoom>
      <Zoom src={src} rect={[1020, 618, 130, 57]} className={styles.s1SendZoom} />

      <span className={`${styles.ripple} ${styles.s1Ripple}`} style={point(1085, 647)} />
      <span className={`${styles.badge} ${styles.s1Badge}`} style={point(1085, 647)}>
        <Check />
      </span>
    </>
  );
}

function ScheduleScene() {
  const src = PROCESS_SCENE_IMAGES[1];
  return (
    <>
      <span className={styles.slot} style={box(1086, 478, 139, 43)}><Clock />20:00</span>
      <span className={styles.slot} style={box(921, 540, 141, 43)}><Clock />10:30</span>
      <span className={styles.slot} style={box(1082, 541, 139, 43)}><Clock />16:00</span>
      <span className={styles.exampleTag} style={box(980, 376, 196, 28)}>Lịch ví dụ minh họa</span>

      <span className={`${styles.dayCover} ${styles.s2Day}`} style={box(594, 571, 33, 25)}>16</span>
      <span className={`${styles.slot} ${styles.s2Slot}`} style={box(924, 478, 141, 43)}><Clock />19:00</span>
      <Zoom src={src} rect={[910, 622, 288, 53]} className={styles.s2ConfirmZoom} />
      <span className={`${styles.ripple} ${styles.s2RippleDay}`} style={point(610, 583)} />
      <span className={`${styles.ripple} ${styles.s2RippleSlot}`} style={point(995, 500)} />
      <span className={`${styles.ripple} ${styles.s2RippleConfirm}`} style={point(1054, 648)} />
      <span className={`${styles.badge} ${styles.s2Badge}`} style={point(1180, 626)}>
        <Check />
      </span>
    </>
  );
}

function SessionScene() {
  return (
    <>
      <span className={`${styles.lobby} ${styles.s3Lobby}`} style={box(597, 378, 683, 272)}>
        <span className={styles.lobbyIcon}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2.5" y="6" width="13" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m15.5 10.5 5-3v9l-5-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.lobbyDots}>
          <span />
          <span />
          <span />
        </span>
        <span className={`${styles.joinButton} ${styles.s3Join}`}>Tham gia</span>
      </span>
      <span className={`${styles.ripple} ${styles.s3Ripple}`} style={point(938, 592)} />
      <span className={`${styles.live} ${styles.s3Live}`} style={point(620, 392)}>
        <span className={styles.liveDot} />
        Đang diễn ra
      </span>
      <span className={`${styles.voice} ${styles.s3Live}`} style={point(744, 520)}>
        <span />
        <span />
        <span />
      </span>
    </>
  );
}

export function ProcessScene({ step, playing }: { step: number; playing: boolean }) {
  return (
    <div className={`${styles.scene} ${playing ? styles.playing : ""}`} aria-hidden="true">
      {step === 0 && <RequestScene />}
      {step === 1 && <ScheduleScene />}
      {step === 2 && <SessionScene />}
    </div>
  );
}
