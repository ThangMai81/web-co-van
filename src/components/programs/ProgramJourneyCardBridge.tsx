"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import styles from "./ProgramJourneyCardBridge.module.css";

type CardAnchor = {
  slug: string;
  x: number;
  y: number;
};

type BridgeGeometry = {
  width: number;
  height: number;
  path: string;
  anchors: CardAnchor[];
  signature: string;
};

const completedProgramJourneyCards = new Set<string>();

export function hasCompletedProgramJourneyCard(slug: string) {
  return completedProgramJourneyCards.has(slug);
}

export function markProgramJourneyCardCompleted(slug: string) {
  completedProgramJourneyCards.add(slug);
}

function readBridgeGeometry(
  grid: HTMLDivElement,
  slugs: string[],
): BridgeGeometry | null {
  const width = grid.clientWidth;
  if (!Number.isFinite(width) || width <= 0 || slugs.length === 0) return null;

  const cardsBySlug = new Map<string, HTMLElement>();
  grid
    .querySelectorAll<HTMLElement>("[data-program-journey-slug]")
    .forEach((element) => {
      const slug = element.dataset.programJourneySlug;
      if (slug) cardsBySlug.set(slug, element);
    });

  const cards = slugs.map((slug) => cardsBySlug.get(slug));
  if (cards.some((card) => !card)) return null;

  const cardElements = cards as HTMLElement[];
  const firstTop = cardElements[0].offsetTop;
  const bottoms = cardElements.map((card) => card.offsetTop + card.offsetHeight);
  const sameRow = cardElements.every(
    (card) =>
      card.offsetParent === grid && Math.abs(card.offsetTop - firstTop) <= 1,
  );
  if (!sameRow || cardElements.some((card) => card.offsetHeight <= 0)) {
    return null;
  }

  const anchors = cardElements.map((card, index) => ({
    slug: slugs[index],
    x: card.offsetLeft + card.offsetWidth / 2,
    y: Math.max(...bottoms) + 12,
  }));

  if (
    anchors.some(
      (anchor) =>
        !Number.isFinite(anchor.x) ||
        anchor.x <= 0 ||
        anchor.x >= width ||
        !Number.isFinite(anchor.y),
    ) ||
    cardElements.some(
      (card) => card.offsetLeft < 0 || card.offsetLeft + card.offsetWidth > width,
    ) ||
    anchors.some(
      (anchor, index) => index > 0 && anchor.x <= anchors[index - 1].x,
    )
  ) {
    return null;
  }

  const allCardElements = Array.from(
    grid.querySelectorAll<HTMLElement>("[data-program-journey-slug]"),
  );
  const nextRowTop = allCardElements
    .map((card) => card.offsetTop)
    .filter((top) => top > firstTop + 1)
    .sort((left, right) => left - right)[0];
  if (nextRowTop !== undefined && nextRowTop - Math.max(...bottoms) < 18) {
    return null;
  }

  const y = anchors[0].y;
  let previousX = 0;
  let path = `M 0 ${y}`;
  anchors.forEach((anchor, index) => {
    const midpoint = (previousX + anchor.x) / 2;
    const bend = index % 2 === 0 ? -3 : 3;
    path += ` C ${midpoint} ${y + bend}, ${midpoint} ${y - bend}, ${anchor.x} ${y}`;
    previousX = anchor.x;
  });

  const height = Math.ceil(y + 12);
  if (!Number.isFinite(height) || height <= 0) return null;

  return {
    width,
    height,
    path,
    anchors,
    signature: `${width}:${height}:${anchors
      .map(({ x, y: anchorY }) => `${x},${anchorY}`)
      .join(";")}`,
  };
}

export default function ProgramJourneyCardBridge({
  gridRef,
  slugs,
  signature,
  enabled,
  animate,
  onReady,
  onFailure,
  onRouteVisibilityChange,
  routePathRef,
}: {
  gridRef: RefObject<HTMLDivElement | null>;
  slugs: string[];
  signature: string;
  enabled: boolean;
  animate: boolean;
  onReady: (signature: string) => void;
  onFailure: (signature: string) => void;
  onRouteVisibilityChange: (signature: string, visible: boolean) => void;
  routePathRef: RefObject<SVGPathElement | null>;
}) {
  const [geometry, setGeometry] = useState<BridgeGeometry | null>(null);
  const [inView, setInView] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [settled, setSettled] = useState(false);
  const animationStarted = useRef(false);
  const lastGeometrySignature = useRef("");
  const slugsKey = JSON.stringify(slugs);
  const hasCompletedCard = slugs.some(hasCompletedProgramJourneyCard);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || slugs.length === 0) {
      onFailure(signature);
      return;
    }

    if (
      typeof ResizeObserver === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      onFailure(signature);
      return;
    }

    let active = true;
    let failed = false;
    let resizeObserver: ResizeObserver | null = null;

    const fail = () => {
      if (!active || failed) return;
      failed = true;
      resizeObserver?.disconnect();
      setGeometry(null);
      onFailure(signature);
    };

    const measure = () => {
      if (!active || failed) return;
      try {
        const next = readBridgeGeometry(grid, slugs);
        if (!next) {
          fail();
          return;
        }

        if (
          lastGeometrySignature.current &&
          lastGeometrySignature.current !== next.signature &&
          animationStarted.current
        ) {
          setRunAnimation(false);
          setSettled(true);
        }
        lastGeometrySignature.current = next.signature;
        setGeometry((current) =>
          current?.signature === next.signature ? current : next,
        );
        onReady(signature);
      } catch {
        fail();
      }
    };

    try {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(grid);

      measure();
    } catch {
      fail();
    }

    return () => {
      active = false;
      resizeObserver?.disconnect();
    };
  }, [gridRef, onFailure, onReady, signature, slugs, slugsKey]);

  useEffect(() => {
    const routePath = routePathRef.current;
    if (!geometry || !routePath) {
      setInView(false);
      onRouteVisibilityChange(signature, false);
      if (geometry && !routePath) onFailure(signature);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      onFailure(signature);
      setInView(false);
      onRouteVisibilityChange(signature, false);
      return;
    }

    let active = true;
    let intersectionObserver: IntersectionObserver | null = null;
    setInView(false);
    onRouteVisibilityChange(signature, false);

    try {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (!active) return;
          const routeEntry = entries.find((entry) => entry.target === routePath);
          const visible = Boolean(
            routeEntry?.isIntersecting && routeEntry.intersectionRatio >= 0.15,
          );
          setInView(visible);
          onRouteVisibilityChange(signature, visible);
        },
        { threshold: [0, 0.15, 1] },
      );
      intersectionObserver.observe(routePath);
    } catch {
      onFailure(signature);
      setInView(false);
      onRouteVisibilityChange(signature, false);
    }

    return () => {
      active = false;
      intersectionObserver?.disconnect();
    };
  }, [geometry?.signature, onFailure, onRouteVisibilityChange, routePathRef, signature]);

  useEffect(() => {
    if (
      !enabled ||
      !animate ||
      !inView ||
      !geometry ||
      hasCompletedCard ||
      animationStarted.current
    ) {
      return;
    }

    animationStarted.current = true;
    setRunAnimation(true);
  }, [animate, enabled, geometry, hasCompletedCard, inView]);

  useEffect(() => {
    if (!runAnimation) return;
    const timeout = window.setTimeout(() => {
      setRunAnimation(false);
      setSettled(true);
    }, 520);
    return () => window.clearTimeout(timeout);
  }, [runAnimation]);

  if (!geometry) return null;

  const showRoute =
    enabled && (runAnimation || settled || hasCompletedCard);
  const nodeClassName = runAnimation ? styles.nodeArriving : styles.nodeRest;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={styles.bridgeSvg}
      data-program-journey-bridge
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      width={geometry.width}
      height={geometry.height}
      style={{
        width: geometry.width,
        height: geometry.height,
        opacity: showRoute ? 1 : 0,
      } as CSSProperties}
    >
      <path
        ref={routePathRef}
        data-program-journey-bridge-path
        data-program-journey-signature={signature}
        d={geometry.path}
        pathLength={1}
        className={
          runAnimation
            ? `${styles.routePath} ${styles.routePathDrawing}`
            : `${styles.routePath} ${styles.routePathRest}`
        }
      />
      {geometry.anchors.map((anchor, index) => (
        <circle
          key={anchor.slug}
          data-program-slug={anchor.slug}
          cx={anchor.x}
          cy={anchor.y}
          r="4.5"
          className={nodeClassName}
          style={
            {
              "--arrival-delay": `${index * 160}ms`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
