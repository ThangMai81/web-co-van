"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { Reveal } from "@/components/animation/Reveal";
import ProgramCard from "./ProgramCard";
import styles from "./ProgramGrid.module.css";
import { useProgramJourneySequence } from "./ProgramJourneySequence";
import ProgramJourneyCardBridge, {
  hasCompletedProgramJourneyCard,
  markProgramJourneyCardCompleted,
} from "./ProgramJourneyCardBridge";
import type { Program } from "@/types/program";

const PAGE_SIZE = 6;
const CARD_ARRIVAL_DELAYS = [0, 160, 320] as const;

function useJourneyBridgeEligibility() {
  const [eligible, setEligible] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      setEligible(false);
      return;
    }

    let query: MediaQueryList;
    try {
      query = window.matchMedia(
        "(min-width: 1280px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      );
    } catch {
      setEligible(false);
      return;
    }

    setEligible(query.matches);

    const disableBridge = () => {
      if (!query.matches) setEligible(false);
    };

    try {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", disableBridge);
        return () => query.removeEventListener("change", disableBridge);
      }

      if (typeof query.addListener === "function") {
        query.addListener(disableBridge);
        return () => query.removeListener(disableBridge);
      }
    } catch {
      setEligible(false);
      return;
    }

    setEligible(false);
  }, []);

  return eligible;
}

export default function ProgramGrid({
  items,
  journeyBridgeTarget = false,
}: {
  items: Program[];
  journeyBridgeTarget?: boolean;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [focused, setFocused] = useState(false);
  const [readySignature, setReadySignature] = useState("");
  const [failedSignature, setFailedSignature] = useState("");
  const [routeVisibility, setRouteVisibility] = useState({
    signature: "",
    visible: false,
  });
  const gridRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const { stage } = useProgramJourneySequence();
  const bridgeEligible = useJourneyBridgeEligibility();
  const revealEnabled =
    stage === "pending" || stage === "static" || stage === "cards";

  const shown = items.slice(0, visible);
  const bridgeSlugs = useMemo(
    () =>
      journeyBridgeTarget
        ? items.slice(0, Math.min(visible, 3)).map((program) => program.slug)
        : [],
    [items, journeyBridgeTarget, visible],
  );
  const bridgeSignature = JSON.stringify(bridgeSlugs);
  const hasCompletedBridgeCard = bridgeSlugs.some(
    hasCompletedProgramJourneyCard,
  );
  const routeVisible =
    routeVisibility.signature === bridgeSignature && routeVisibility.visible;
  const geometryReady =
    readySignature === bridgeSignature && failedSignature !== bridgeSignature;
  const bridgeEnabled =
    journeyBridgeTarget &&
    bridgeEligible === true &&
    !focused &&
    stage === "cards" &&
    geometryReady;
  const bridgeAnimate = bridgeEnabled && !hasCompletedBridgeCard;
  const bridgeStartReady = bridgeAnimate && routeVisible;
  const shouldMeasureBridge =
    journeyBridgeTarget &&
    bridgeEligible === true &&
    !focused &&
    bridgeSlugs.length > 0;
  const waitForBridgeStart =
    journeyBridgeTarget &&
    bridgeEligible !== false &&
    stage !== "static" &&
    !focused &&
    bridgeSlugs.length > 0 &&
    !hasCompletedBridgeCard &&
    failedSignature !== bridgeSignature;
  const hasMore = visible < items.length;

  const handleBridgeReady = useCallback((signature: string) => {
    setFailedSignature((current) =>
      current === signature ? "" : current,
    );
    setReadySignature(signature);
  }, []);
  const handleBridgeFailure = useCallback((signature: string) => {
    setFailedSignature(signature);
    setRouteVisibility({ signature, visible: false });
  }, []);
  const handleBridgeRouteVisibility = useCallback(
    (signature: string, visible: boolean) => {
      setRouteVisibility({ signature, visible });
    },
    [],
  );
  const handleBridgeFocus = useCallback(() => {
    setFocused(true);
  }, []);
  const handleRevealEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>, slug: string) => {
      if (
        event.propertyName !== "opacity" ||
        event.target !== event.currentTarget.firstElementChild
      ) {
        return;
      }

      markProgramJourneyCardCompleted(slug);
    },
  );

  return (
    <div
      className={journeyBridgeTarget ? "relative xl:-mx-6 xl:px-6" : ""}
      onFocusCapture={journeyBridgeTarget ? handleBridgeFocus : undefined}
    >
      <div
        ref={gridRef}
        className={`${journeyBridgeTarget ? "relative isolate " : ""}grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6`}
      >
        {shouldMeasureBridge ? (
          <ProgramJourneyCardBridge
            key={bridgeSignature}
            gridRef={gridRef}
            slugs={bridgeSlugs}
            signature={bridgeSignature}
            enabled={bridgeEnabled}
            animate={bridgeAnimate}
            onReady={handleBridgeReady}
            onFailure={handleBridgeFailure}
            onRouteVisibilityChange={handleBridgeRouteVisibility}
            routePathRef={routePathRef}
          />
        ) : null}
        {shown.map((program, index) => {
          const cardCompleted = hasCompletedProgramJourneyCard(program.slug);
          const firstRowWaiting =
            waitForBridgeStart && index < CARD_ARRIVAL_DELAYS.length;
          const cardRevealEnabled =
            revealEnabled && (!firstRowWaiting || bridgeStartReady);
          const cardDelay =
            bridgeAnimate && index < CARD_ARRIVAL_DELAYS.length
              ? CARD_ARRIVAL_DELAYS[index]
              : Math.min(index * 60, 300);

          return (
            <div
              key={program._id}
              data-program-journey-slug={program.slug}
              onTransitionEnd={(event) => handleRevealEnd(event, program.slug)}
            >
              {cardCompleted ? (
                <div
                  className={`${journeyBridgeTarget ? "relative z-10 " : ""}h-full`}
                >
                  <ProgramCard program={program} />
                </div>
              ) : (
                <Reveal
                  direction="up"
                  delay={cardDelay}
                  className={`${journeyBridgeTarget ? "relative z-10 " : ""}h-full ${styles.programCardReveal}`}
                  enabled={cardRevealEnabled}
                  showOnObserverSetupError
                >
                  <ProgramCard program={program} />
                </Reveal>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border-2 border-blue bg-white px-8 py-2.5 text-sm font-bold text-blue transition hover:bg-blue hover:text-white"
          >
            Xem thêm ({items.length - visible} chương trình)
          </button>
        </div>
      )}
    </div>
  );
}
