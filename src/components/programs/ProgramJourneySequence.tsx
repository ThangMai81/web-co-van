"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import ProgramHeroCountUp from "./ProgramHeroCountUp";
import milestoneStyles from "./ProgramJourneyMilestones.module.css";
import motionStyles from "@/components/ui/PhysicalHeroMotion.module.css";
import type { Program } from "@/types/program";

type JourneyStage = "pending" | "static" | "path" | "stats" | "cards";

type JourneySequenceValue = {
  stage: JourneyStage;
  completePath: () => void;
  useStaticFallback: () => void;
};

type JourneyProgram = Pick<Program, "slug" | "title">;
type CurvePoint = { x: number; y: number };
type CurveSegment = {
  start: CurvePoint;
  control1: CurvePoint;
  control2: CurvePoint;
  end: CurvePoint;
};
type JourneyMilestone = {
  program: JourneyProgram;
  point: CurvePoint;
  progress: number;
};

const JOURNEY_SEGMENTS: CurveSegment[] = [
  {
    start: { x: 6, y: 30 },
    control1: { x: 36, y: 4 },
    control2: { x: 78, y: 6 },
    end: { x: 110, y: 22 },
  },
  {
    start: { x: 110, y: 22 },
    control1: { x: 142, y: 38 },
    control2: { x: 180, y: 38 },
    end: { x: 214, y: 8 },
  },
];
const JOURNEY_PATH_D = [
  `M ${JOURNEY_SEGMENTS[0].start.x} ${JOURNEY_SEGMENTS[0].start.y}`,
  ...JOURNEY_SEGMENTS.map(
    ({ control1, control2, end }) =>
      `C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`,
  ),
].join(" ");
const PATH_SAMPLE_STEPS = 128;

function getCubicPoint(segment: CurveSegment, progress: number): CurvePoint {
  const inverse = 1 - progress;
  const startWeight = inverse * inverse * inverse;
  const control1Weight = 3 * inverse * inverse * progress;
  const control2Weight = 3 * inverse * progress * progress;
  const endWeight = progress * progress * progress;

  return {
    x:
      segment.start.x * startWeight +
      segment.control1.x * control1Weight +
      segment.control2.x * control2Weight +
      segment.end.x * endWeight,
    y:
      segment.start.y * startWeight +
      segment.control1.y * control1Weight +
      segment.control2.y * control2Weight +
      segment.end.y * endWeight,
  };
}

const JOURNEY_PATH_SAMPLES = (() => {
  const samples: Array<CurvePoint & { distance: number }> = [];
  let distance = 0;

  JOURNEY_SEGMENTS.forEach((segment, segmentIndex) => {
    const firstStep = segmentIndex === 0 ? 0 : 1;

    for (let step = firstStep; step <= PATH_SAMPLE_STEPS; step += 1) {
      const point = getCubicPoint(segment, step / PATH_SAMPLE_STEPS);
      const previous = samples[samples.length - 1];
      if (previous) {
        distance += Math.hypot(point.x - previous.x, point.y - previous.y);
      }
      samples.push({ ...point, distance });
    }
  });

  return samples;
})();
const JOURNEY_PATH_LENGTH =
  JOURNEY_PATH_SAMPLES[JOURNEY_PATH_SAMPLES.length - 1].distance;

function getPointAtProgress(progress: number): CurvePoint {
  const targetDistance = JOURNEY_PATH_LENGTH * progress;
  const matchIndex = JOURNEY_PATH_SAMPLES.findIndex(
    (sample) => sample.distance >= targetDistance,
  );
  const afterIndex = Math.max(1, matchIndex < 0 ? JOURNEY_PATH_SAMPLES.length - 1 : matchIndex);
  const before = JOURNEY_PATH_SAMPLES[afterIndex - 1];
  const after = JOURNEY_PATH_SAMPLES[afterIndex];
  const distanceSpan = after.distance - before.distance;
  const localProgress =
    distanceSpan > 0 ? (targetDistance - before.distance) / distanceSpan : 0;

  return {
    x: before.x + (after.x - before.x) * localProgress,
    y: before.y + (after.y - before.y) * localProgress,
  };
}

function getJourneyMilestones(programs: JourneyProgram[]): JourneyMilestone[] {
  return programs.map((program, index) => {
    const progress =
      programs.length === 1 ? 1 : index / Math.max(1, programs.length - 1);

    return {
      program,
      point: getPointAtProgress(progress),
      progress,
    };
  });
}

const staticSequence: JourneySequenceValue = {
  stage: "static",
  completePath: () => undefined,
  useStaticFallback: () => undefined,
};

const JourneySequenceContext = createContext(staticSequence);
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function subscribeToMediaQuery(
  query: MediaQueryList,
  listener: () => void,
): (() => void) | null {
  try {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    }

    if (typeof query.addListener === "function") {
      query.addListener(listener);
      return () => query.removeListener(listener);
    }
  } catch {
    return null;
  }

  return null;
}

export function ProgramJourneySequenceProvider({
  children,
  hasPrograms,
}: {
  children: ReactNode;
  hasPrograms: boolean;
}) {
  const [stage, setStage] = useState<JourneyStage>(
    hasPrograms ? "pending" : "static",
  );

  useIsomorphicLayoutEffect(() => {
    if (!hasPrograms) {
      setStage("static");
      return;
    }

    if (
      typeof window.matchMedia !== "function" ||
      typeof window.requestAnimationFrame !== "function" ||
      typeof window.cancelAnimationFrame !== "function" ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.CSS?.supports !== "function"
    ) {
      setStage("static");
      return;
    }

    let desktopQuery: MediaQueryList;
    let finePointerQuery: MediaQueryList;
    let reducedMotionQuery: MediaQueryList;

    try {
      desktopQuery = window.matchMedia("(min-width: 1024px)");
      finePointerQuery = window.matchMedia("(pointer: fine)");
      reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      ) as SVGPathElement;
      path.setAttribute("d", "M 0 0 L 1 0");

      if (
        !window.CSS.supports("stroke-dasharray", "1") ||
        typeof path.getTotalLength !== "function" ||
        typeof path.getPointAtLength !== "function" ||
        path.getTotalLength() <= 0
      ) {
        setStage("static");
        return;
      }
    } catch {
      setStage("static");
      return;
    }

    const isEligible = () =>
      desktopQuery.matches &&
      finePointerQuery.matches &&
      !reducedMotionQuery.matches;

    if (!isEligible()) {
      setStage("static");
      return;
    }

    const cleanups: Array<() => void> = [];
    const handleMediaChange = () => {
      if (!isEligible()) setStage("static");
    };

    for (const query of [
      desktopQuery,
      finePointerQuery,
      reducedMotionQuery,
    ]) {
      const cleanup = subscribeToMediaQuery(query, handleMediaChange);
      if (!cleanup) {
        cleanups.forEach((removeListener) => removeListener());
        setStage("static");
        return;
      }
      cleanups.push(cleanup);
    }

    setStage("path");
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [hasPrograms]);

  const completePath = useCallback(() => {
    setStage((current) => (current === "path" ? "stats" : current));
  }, []);
  const useStaticFallback = useCallback(() => {
    setStage("static");
  }, []);

  useEffect(() => {
    if (stage !== "path") return;

    const timeout = window.setTimeout(completePath, 900);
    return () => window.clearTimeout(timeout);
  }, [completePath, stage]);

  useEffect(() => {
    if (stage !== "stats") return;

    const timeout = window.setTimeout(() => {
      setStage((current) => (current === "stats" ? "cards" : current));
    }, 740);
    return () => window.clearTimeout(timeout);
  }, [stage]);

  return (
    <JourneySequenceContext.Provider
      value={{ stage, completePath, useStaticFallback }}
    >
      {children}
    </JourneySequenceContext.Provider>
  );
}

export function useProgramJourneySequence() {
  return useContext(JourneySequenceContext);
}

export function ProgramJourneyCurve({
  items,
}: {
  items: JourneyProgram[];
}) {
  const { stage, completePath, useStaticFallback } =
    useProgramJourneySequence();
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const milestones = useMemo(() => getJourneyMilestones(items), [items]);

  const handlePathAnimationEnd = (event: AnimationEvent<SVGPathElement>) => {
    if (event.currentTarget === event.target) completePath();
  };

  useIsomorphicLayoutEffect(() => {
    if (stage !== "path") return;

    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) {
      useStaticFallback();
      return;
    }

    let pathLength: number;
    try {
      pathLength = path.getTotalLength();
      if (!Number.isFinite(pathLength) || pathLength <= 0) {
        useStaticFallback();
        return;
      }
    } catch {
      useStaticFallback();
      return;
    }

    let startTime: number | null = null;
    let frame: number | null = null;

    const trackCurve = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min(1, (timestamp - startTime) / 800);

      try {
        const point = path.getPointAtLength(pathLength * progress);
        marker.setAttribute("cx", String(point.x));
        marker.setAttribute("cy", String(point.y));
      } catch {
        useStaticFallback();
        return;
      }

      if (progress >= 1) {
        frame = null;
        completePath();
        return;
      }

      try {
        frame = window.requestAnimationFrame(trackCurve);
      } catch {
        useStaticFallback();
      }
    };

    try {
      frame = window.requestAnimationFrame(trackCurve);
    } catch {
      useStaticFallback();
    }

    return () => {
      if (frame !== null) {
        try {
          window.cancelAnimationFrame(frame);
        } catch {
          // The marker still returns to the path endpoint below.
        }
      }
      marker.setAttribute("cx", "214");
      marker.setAttribute("cy", "8");
    };
  }, [completePath, stage, useStaticFallback]);

  const pathClassName = [
    motionStyles.journeyPath,
    stage === "path" ? motionStyles.journeyPathDrawing : "",
    stage === "stats" || stage === "cards"
      ? motionStyles.journeyPathComplete
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const isSequenced =
    stage === "path" || stage === "stats" || stage === "cards";

  const curveClassName = [
    motionStyles.journeyCurve,
    milestoneStyles.curveFrame,
    isSequenced ? motionStyles.journeyCurveSequenced : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      aria-hidden="true"
      className={curveClassName}
      data-stage={stage}
    >
      <svg
        focusable="false"
        viewBox="0 0 220 44"
        className={milestoneStyles.journeySvg}
      >
        <path
          ref={pathRef}
          id="programs-journey-path"
          d={JOURNEY_PATH_D}
          pathLength={1}
          className={pathClassName}
          onAnimationEnd={handlePathAnimationEnd}
        />
        {milestones.map(({ program, point, progress }) => (
          <circle
            key={program.slug}
            cx={point.x}
            cy={point.y}
            r="2.8"
            className={milestoneStyles.milestonePoint}
            style={
              {
                "--milestone-delay": `${progress * 800}ms`,
              } as CSSProperties
            }
          />
        ))}
        <circle
          ref={markerRef}
          cx={stage === "path" ? "6" : "214"}
          cy={stage === "path" ? "30" : "8"}
          r="3.4"
          className={motionStyles.waypointMoving}
        />
        <circle
          cx="214"
          cy="8"
          r="3.4"
          className={motionStyles.waypointRest}
        />
      </svg>
      {milestones.map(({ program, point, progress }, index) => {
        const alignment = point.x < 20 ? "start" : point.x > 200 ? "end" : "center";

        return (
          <span
            key={program.slug}
            className={milestoneStyles.milestoneLabel}
            data-align={alignment}
            data-lane={index % 5}
            style={
              {
                "--milestone-delay": `${progress * 800}ms`,
                "--milestone-x": `${(point.x / 220) * 100}%`,
                "--milestone-y": `${(point.y / 44) * 100}%`,
              } as CSSProperties
            }
          >
            {program.title}
          </span>
        );
      })}
    </div>
  );
}

export function ProgramJourneyStats({
  total,
  upcoming,
}: {
  total: number;
  upcoming: number;
}) {
  const { stage } = useProgramJourneySequence();
  const isSequenced = stage === "path" || stage === "stats" || stage === "cards";
  const isWaitingForPath = stage === "path";
  const canStartCountUp = stage !== "pending" && !isWaitingForPath;

  return (
    <div
      aria-hidden={isWaitingForPath}
      className={[
        motionStyles.programsStats,
        isSequenced ? motionStyles.programsStatsControlled : "",
        isWaitingForPath ? motionStyles.programsStatsWaiting : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ProgramHeroCountUp
        total={total}
        upcoming={upcoming}
        sequenceReveal={stage === "stats" || stage === "cards"}
        startCountUp={canStartCountUp}
      />
    </div>
  );
}
