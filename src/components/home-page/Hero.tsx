"use client";

// import Image from "next/image"; // Restore with the commented Sunshine banner below.
import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "@/lib/icons";
import { FloatingContact } from "@/components/chatbot/FloatingContact";
import { HomeHeroBackdrop } from "./HomeHeroBackdrop";
import styles from "./HomeHeroBackdrop.module.css";

const SUNRISE_BLOOM_DURATION_MS = 840;

export function Hero() {
  const entryPendingRef = useRef(true);
  const sunriseBloomStartedRef = useRef(false);
  const sunriseBloomTimerRef = useRef<number | null>(null);
  const [entryMotionActive, setEntryMotionActive] = useState(false);
  const [contactMotionActive, setContactMotionActive] = useState(false);
  const [sunriseBloomActive, setSunriseBloomActive] = useState(false);
  const [sunriseBloomSettled, setSunriseBloomSettled] = useState(false);

  const settleSunriseBloom = useCallback(() => {
    if (sunriseBloomTimerRef.current !== null) {
      window.clearTimeout(sunriseBloomTimerRef.current);
      sunriseBloomTimerRef.current = null;
    }
    setSunriseBloomActive(false);
    setSunriseBloomSettled(true);
  }, []);

  const settleEntryMotion = useCallback(() => {
    entryPendingRef.current = false;
    sunriseBloomStartedRef.current = true;
    setEntryMotionActive(false);
    settleSunriseBloom();
  }, [settleSunriseBloom]);

  const handleHomeBloomEligibilityChange = useCallback(
    (allowed: boolean) => {
      if (!entryPendingRef.current) return;

      if (!allowed) {
        if (sunriseBloomStartedRef.current) settleSunriseBloom();
        return;
      }

      if (
        sunriseBloomStartedRef.current ||
        typeof window.matchMedia !== "function"
      ) {
        return;
      }

      const desktopQuery = window.matchMedia("(min-width: 1024px)");
      const finePointerQuery = window.matchMedia("(pointer: fine)");
      if (!desktopQuery.matches || !finePointerQuery.matches) {
        sunriseBloomStartedRef.current = true;
        setSunriseBloomSettled(true);
        return;
      }

      sunriseBloomStartedRef.current = true;
      setSunriseBloomSettled(false);
      setSunriseBloomActive(true);
    },
    [settleSunriseBloom],
  );

  useEffect(() => {
    if (!sunriseBloomActive) return;

    const timer = window.setTimeout(() => {
      sunriseBloomTimerRef.current = null;
      setSunriseBloomActive(false);
      setSunriseBloomSettled(true);
    }, SUNRISE_BLOOM_DURATION_MS);
    sunriseBloomTimerRef.current = timer;

    return () => {
      window.clearTimeout(timer);
      if (sunriseBloomTimerRef.current === timer) {
        sunriseBloomTimerRef.current = null;
      }
    };
  }, [sunriseBloomActive]);

  useEffect(() => {
    if (!sunriseBloomActive) return;
    if (typeof window.matchMedia !== "function") {
      sunriseBloomStartedRef.current = true;
      settleSunriseBloom();
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const cancelIfIneligible = () => {
      if (desktopQuery.matches && finePointerQuery.matches) return;
      sunriseBloomStartedRef.current = true;
      settleSunriseBloom();
    };
    const subscribe = (query: MediaQueryList) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", cancelIfIneligible);
        return () => query.removeEventListener("change", cancelIfIneligible);
      }
      query.addListener(cancelIfIneligible);
      return () => query.removeListener(cancelIfIneligible);
    };
    const removeDesktopListener = subscribe(desktopQuery);
    const removePointerListener = subscribe(finePointerQuery);
    const cancelOnScroll = () => {
      sunriseBloomStartedRef.current = true;
      settleSunriseBloom();
    };

    cancelIfIneligible();
    window.addEventListener("scroll", cancelOnScroll, { passive: true });

    return () => {
      removeDesktopListener();
      removePointerListener();
      window.removeEventListener("scroll", cancelOnScroll);
    };
  }, [sunriseBloomActive, settleSunriseBloom]);

  const handleEntryMotionPermissionChange = useCallback(
    (allowed: boolean) => {
      if (!entryPendingRef.current) return;
      if (!allowed) {
        settleEntryMotion();
        return;
      }
      setEntryMotionActive(true);
    },
    [settleEntryMotion],
  );

  return (
    <>
      <section
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-white"
        onFocusCapture={settleEntryMotion}
        onPointerDownCapture={settleEntryMotion}
      >
        <HomeHeroBackdrop
          homeBloomActive={sunriseBloomActive}
          homeParallaxEnabled={sunriseBloomSettled}
          onHomeBloomEligibilityChange={handleHomeBloomEligibilityChange}
          onEntryMotionAllowedChange={handleEntryMotionPermissionChange}
          onMotionActiveChange={setContactMotionActive}
          onMotionPause={settleEntryMotion}
        />
        <FloatingContact motionActive={contactMotionActive} />

        <div
          className={`${styles.heroContent} relative z-10 mx-auto flex w-full max-w-[var(--page-w)] flex-1 flex-col justify-center px-6 pt-[120px] pb-8 sm:pt-[74px] sm:pb-20`}
          data-entry-active={entryMotionActive}
        >
          <div
            className={`${styles.heroEntry} ${styles.heroKicker} mb-3 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-widest text-white sm:mb-5`}
          >
            <span className="hidden h-px w-6 shrink-0 bg-yellow sm:block" />
            <span className="min-w-0 truncate tracking-wide lg:hidden">
              Tỉnh thức · Trí tuệ · Yêu thương
            </span>
            <span className="hidden lg:inline">
              Coach Yến Lê - Chạm vào tỉnh thức - Khơi nguồn trí tuệ - Lan tỏa yêu
              thương
            </span>
            <span className="hidden h-px w-6 shrink-0 bg-yellow sm:block" />
          </div>

          <h1
            className={`${styles.heroEntry} ${styles.heroHeading} max-w-[13ch] font-display text-[clamp(36px,5.6vw,78px)] font-bold leading-[1.03] text-white [text-shadow:0_2px_22px_rgba(9,27,57,0.4)] sm:max-w-[18ch] md:max-w-[24ch] lg:max-w-[18ch]`}
          >
            <svg
              className={styles.heroLineDetail}
              viewBox="0 0 8 64"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className={styles.heroLineDetailPath}
                d="M0.5 0.5V48C0.5 57 2.5 63.5 7.5 63.5"
                pathLength={64}
              />
            </svg>
            <em className="text-white not-italic md:block lg:inline">
              SUNSHINE CENTER
            </em>{" "}
            "Đánh
            thức ánh sáng bên trong – Kiến tạo cuộc đời bạn mong muốn"
          </h1>

          <div
            className={`${styles.heroEntry} ${styles.heroActions} mt-5 flex flex-wrap gap-4 sm:mt-8 xl:mt-10`}
          >
            <a
              href="#videos"
              className="flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-blue ring-1 ring-blue transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              <Play size={14} />
              Xem video
            </a>
            <a
              href="#lien-he"
              className="rounded-full border-2 border-blue bg-white/80 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-blue backdrop-blur-sm transition hover:border-blue hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              Đồng hành cùng chúng tôi
            </a>
          </div>
        </div>
      </section>

      <section className="bg-blue px-6 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-[var(--page-w)]">
          <p className="max-w-[52ch] text-lg italic text-white/80">
            Chúng tôi tin rằng mỗi người đều mang trong mình những tiềm năng và
            giá trị riêng biệt. Sunshine Center đồng hành cùng bạn trên hành
            trình thấu hiểu bản thân, khai mở nội lực, vượt qua giới hạn và từng
            bước kiến tạo một cuộc sống hạnh phúc, tự tin, thành công và ý nghĩa
            hơn. Yes Yes Yes
          </p>
        </div>
      </section>

      {/*
      <section className="relative overflow-hidden bg-blue pb-16">
        <div className="relative aspect-[16/8] w-full overflow-hidden border-y-2 border-yellow shadow-xl shadow-black/20 sm:aspect-[16/6] lg:aspect-[16/5]">
          <Image
            src="/images/Sunshine_banner.jpg"
            alt="Sunshine Center"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </section>
      */}
    </>
  );
}
