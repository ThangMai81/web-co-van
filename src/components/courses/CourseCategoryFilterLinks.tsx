"use client";

import Link from "next/link";
import { useEffect, useState, type AnimationEvent, type MouseEvent } from "react";
import { COURSE_CATEGORY_LABELS } from "@/lib/courseLabels";
import CourseCategoryIcon from "./CourseCategoryIcon";
import styles from "./CourseCategoryFilterLinks.module.css";

function buildHref(category?: string, sort?: string, search?: string) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (sort) query.set("sort", sort);
  if (search) query.set("search", search);
  const qs = query.toString();
  return qs ? `/courses?${qs}` : "/courses";
}

function isEligibleForSpring() {
  if (typeof window.matchMedia !== "function") return false;

  try {
    return (
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    );
  } catch {
    return false;
  }
}

function isPrimarySameTabActivation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !event.defaultPrevented
  );
}

export default function CourseCategoryFilterLinks({
  activeCategory,
  activeSort,
  activeSearch,
}: {
  activeCategory?: string;
  activeSort?: string;
  activeSearch?: string;
}) {
  const [springingCategory, setSpringingCategory] = useState<string | null>(null);
  const categories = Object.keys(COURSE_CATEGORY_LABELS);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    let queries: MediaQueryList[];
    try {
      queries = [
        window.matchMedia("(min-width: 1024px)"),
        window.matchMedia("(pointer: fine)"),
        window.matchMedia("(prefers-reduced-motion: no-preference)"),
      ];
    } catch {
      setSpringingCategory(null);
      return;
    }

    const clearWhenIneligible = () => {
      if (!queries.every((query) => query.matches)) setSpringingCategory(null);
    };
    const cleanups: Array<() => void> = [];

    for (const query of queries) {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", clearWhenIneligible);
        cleanups.push(() => query.removeEventListener("change", clearWhenIneligible));
      } else if (typeof query.addListener === "function") {
        query.addListener(clearWhenIneligible);
        cleanups.push(() => query.removeListener(clearWhenIneligible));
      }
    }

    clearWhenIneligible();
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const handleAllClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isPrimarySameTabActivation(event)) setSpringingCategory(null);
  };

  const handleCategoryClick = (category: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPrimarySameTabActivation(event)) return;
    if (category === activeCategory || !isEligibleForSpring()) {
      setSpringingCategory(null);
      return;
    }
    setSpringingCategory(category);
  };

  const handleIconAnimationEnd = (category: string) => (event: AnimationEvent<HTMLAnchorElement>) => {
    if (event.target !== event.currentTarget.firstElementChild) return;
    setSpringingCategory((current) => (current === category ? null : current));
  };

  return (
    <>
      <Link
        href={buildHref(undefined, activeSort, activeSearch)}
        scroll={false}
        onClick={handleAllClick}
        className={`inline-flex min-h-11 items-center rounded-full px-3.5 py-2 text-sm transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          !activeCategory
            ? "bg-yellow font-extrabold text-blue shadow-sm"
            : "font-bold text-blue/80 hover:bg-yellow/25"
        }`}
      >
        Tất cả
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={buildHref(cat, activeSort, activeSearch)}
          scroll={false}
          onClick={handleCategoryClick(cat)}
          onAnimationEnd={handleIconAnimationEnd(cat)}
          className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
            activeCategory === cat
              ? "bg-yellow font-extrabold text-blue shadow-sm"
              : "font-bold text-blue/80 hover:bg-yellow/25"
          }`}
        >
          <CourseCategoryIcon
            category={cat}
            size={14}
            className={springingCategory === cat ? styles.spring : undefined}
          />
          {COURSE_CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </>
  );
}
