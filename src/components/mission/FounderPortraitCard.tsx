"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./FounderPortraitCard.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (
    typeof query.addEventListener === "function" &&
    typeof query.removeEventListener === "function"
  ) {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  if (
    typeof query.addListener === "function" &&
    typeof query.removeListener === "function"
  ) {
    query.addListener(listener);
    return () => query.removeListener(listener);
  }

  throw new Error("Media query change events are unavailable");
}

export function FounderPortraitCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const reveal = card?.closest<HTMLElement>("[data-visible]");
    if (!card || !reveal || typeof window.matchMedia !== "function") return;

    let motionQuery: MediaQueryList;
    try {
      motionQuery = window.matchMedia(MOTION_QUERY);
    } catch {
      return;
    }
    if (!motionQuery.matches) return;

    let canAnimate = true;
    let opacitySettled = false;
    let positionSettled = false;
    let removeMediaListener = () => {};

    const handleRevealTransitionEnd = (event: TransitionEvent) => {
      if (
        !canAnimate ||
        event.target !== reveal ||
        reveal.getAttribute("data-visible") !== "true"
      ) {
        return;
      }

      if (event.propertyName === "opacity") {
        opacitySettled = true;
      } else if (
        event.propertyName === "transform" ||
        event.propertyName === "translate"
      ) {
        positionSettled = true;
      } else {
        return;
      }

      if (!opacitySettled || !positionSettled) return;
      try {
        card.classList.add(styles.settleActive);
      } catch {
        disableMotion();
        return;
      }
      reveal.removeEventListener("transitionend", handleRevealTransitionEnd);
    };

    const disableMotion = () => {
      if (!canAnimate) return;
      canAnimate = false;
      card.classList.remove(styles.settleActive);
      reveal.removeEventListener("transitionend", handleRevealTransitionEnd);
      try {
        removeMediaListener();
      } catch {
        // The portrait remains at its static geometry.
      }
    };

    try {
      removeMediaListener = subscribeToMediaQuery(motionQuery, () => {
        try {
          if (!motionQuery.matches) disableMotion();
        } catch {
          disableMotion();
        }
      });
      reveal.addEventListener("transitionend", handleRevealTransitionEnd);
    } catch {
      disableMotion();
      return;
    }

    return disableMotion;
  }, []);

  return (
    <div
      ref={cardRef}
      className={[
        styles.portraitCard,
        "relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-yellow shadow-lg shadow-blue/10",
      ].join(" ")}
    >
      <Image
        src="/images/Yến.jpg"
        alt="Shining Coach Yến Lê"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
