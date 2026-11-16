"use client";

import { useEffect, useRef } from "react";
import styles from "./AuthScene.module.css";

/**
 * Tranh minh họa vẽ bằng SVG cho cột trái các trang đăng nhập.
 * Ban ngày (6h–18h theo giờ máy người xem): bình minh với mặt trời.
 * Buổi tối: trời đêm với trăng và nhiều sao hơn.
 */
export default function AuthScene() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const apply = () => {
      const hour = new Date().getHours();
      root.dataset.time = hour >= 6 && hour < 18 ? "day" : "night";
    };
    apply();
    const timer = window.setInterval(apply, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" data-time="day" className={styles.scene}>
      <svg className={styles.layer} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0f1d3d" />
            <stop offset="0.38" stopColor="#24407a" />
            <stop offset="0.6" stopColor="#c27b52" />
            <stop offset="0.72" stopColor="#ffc85a" />
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#auth-sky)" />
        <g className={styles.stars} fill="#fff">
          {[
            [90, 80, 1.6], [180, 150, 1.1], [260, 60, 1.4], [370, 120, 1], [470, 70, 1.5],
            [560, 160, 1.2], [650, 90, 1.7], [730, 190, 1], [120, 240, 1], [610, 250, 1.1],
            [300, 210, 0.9], [700, 40, 1.2],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} style={{ animationDelay: `${(i % 6) * 0.7}s` }} />
          ))}
        </g>
      </svg>

      <div className={styles.nightSky} />
      <svg className={`${styles.layer} ${styles.moon}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="auth-moon-glow">
            <stop offset="0" stopColor="#fdf6d8" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fdf6d8" stopOpacity="0" />
          </radialGradient>
          <mask id="auth-moon-crescent">
            <rect width="800" height="1000" fill="white" />
            <circle cx="452" cy="300" r="78" fill="black" />
          </mask>
        </defs>
        <circle cx="420" cy="320" r="190" fill="url(#auth-moon-glow)" />
        <circle cx="420" cy="320" r="84" fill="#fdf3c8" mask="url(#auth-moon-crescent)" />
        <g fill="#fff">
          {[[140, 330, 1.3], [250, 420, 1], [620, 360, 1.4], [700, 300, 1], [560, 470, 1], [90, 460, 1.2]].map(([cx, cy, r], i) => (
            <circle key={i} className={styles.nightStar} cx={cx} cy={cy} r={r} style={{ animationDelay: `${i * 0.6}s` }} />
          ))}
        </g>
      </svg>

      <svg className={`${styles.layer} ${styles.sun}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="auth-glow">
            <stop offset="0" stopColor="#fff3b0" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#fece01" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fece01" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="400" cy="330" r="300" fill="url(#auth-glow)" />
        <g className={styles.rays} stroke="#fece01" strokeWidth="6" strokeLinecap="round" opacity="0.55">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={400 + Math.cos(a) * 120}
                y1={330 + Math.sin(a) * 120}
                x2={400 + Math.cos(a) * (i % 2 ? 165 : 190)}
                y2={330 + Math.sin(a) * (i % 2 ? 165 : 190)}
              />
            );
          })}
        </g>
        <circle cx="400" cy="330" r="96" fill="#ffd93b" />
        <circle cx="400" cy="330" r="96" fill="none" stroke="#fff6c8" strokeWidth="4" opacity="0.7" />
      </svg>

      <svg className={`${styles.layer} ${styles.far}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <path d="M-40 640 L90 520 L170 580 L280 470 L380 560 L470 500 L560 575 L660 480 L760 560 L860 520 L860 1000 L-40 1000Z" fill="#6f8fc9" />
      </svg>

      <svg className={`${styles.layer} ${styles.cloudsBack}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <g fill="#fff6e6" opacity="0.75">
          <ellipse cx="120" cy="640" rx="190" ry="34" />
          <ellipse cx="420" cy="655" rx="230" ry="30" />
          <ellipse cx="720" cy="640" rx="200" ry="36" />
        </g>
      </svg>

      <svg className={`${styles.layer} ${styles.mid}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <path d="M-40 760 L60 650 L150 700 L250 610 L350 690 L430 640 L520 710 L640 620 L740 690 L860 640 L860 1000 L-40 1000Z" fill="#2f4f8f" />
        <path d="M250 610 L276 636 L262 640 L250 628 L238 642 L226 636Z M640 620 L664 642 L650 646 L640 634 L628 648 L618 642Z" fill="#dfe8fb" opacity="0.8" />
      </svg>

      <svg className={`${styles.layer} ${styles.cloudsFront}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="60" cy="770" rx="220" ry="40" />
          <ellipse cx="360" cy="790" rx="260" ry="38" />
          <ellipse cx="700" cy="770" rx="240" ry="44" />
        </g>
      </svg>

      <svg className={`${styles.layer} ${styles.near}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <path d="M-40 860 Q150 760 330 820 T680 790 Q780 785 860 820 L860 1000 L-40 1000Z" fill="#162a54" />
        <path
          className={styles.path}
          d="M250 1000 C300 940 230 905 300 870 S420 840 440 815"
          fill="none"
          stroke="#fece01"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="2 22"
        />
        <g fill="#0f1d3d">
          <path d="M600 840 l18 -64 l18 64z M626 846 l14 -48 l14 48z M110 870 l16 -58 l16 58z" />
        </g>
      </svg>

      <svg className={`${styles.layer} ${styles.birds}`} viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#0f1d3d" strokeWidth="3" strokeLinecap="round" opacity="0.65">
          <path d="M540 230 q10 -10 20 0 q10 -10 20 0" />
          <path d="M585 260 q7 -7 14 0 q7 -7 14 0" />
          <path d="M510 272 q6 -6 12 0 q6 -6 12 0" />
        </g>
      </svg>
    </div>
  );
}
