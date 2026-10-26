"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./HomeHeroBackdrop.module.css";

const VIDEO_SOURCE = "/videos/home-fansipan-0147-loop.mp4";
const POSTER_SOURCE = "/images/home-fansipan-0147-poster.jpg";
const SECTION_CONTROL_SIZE_REM = 2.75;
const SECTION_CONTROL_INSET_REM = 1;
const HEADER_BOTTOM_PX = 74;

type PlaybackParticipant = {
  eligible: boolean;
  visibilityRatio: number;
};

const playbackParticipants = new Map<HTMLVideoElement, PlaybackParticipant>();
const playbackSubscribers = new Set<() => void>();
let activePlaybackVideo: HTMLVideoElement | null = null;

function selectActivePlaybackVideo() {
  let bestEligibleVideo: HTMLVideoElement | null = null;
  let bestEligibleRatio = -1;
  for (const [video, state] of playbackParticipants) {
    if (!state.eligible) continue;
    if (
      state.visibilityRatio > bestEligibleRatio ||
      (state.visibilityRatio === bestEligibleRatio &&
        video === activePlaybackVideo)
    ) {
      bestEligibleVideo = video;
      bestEligibleRatio = state.visibilityRatio;
    }
  }

  return bestEligibleVideo;
}

function publishActivePlaybackVideo(nextVideo: HTMLVideoElement | null) {
  if (activePlaybackVideo === nextVideo) return;

  const previousVideo = activePlaybackVideo;
  activePlaybackVideo = nextVideo;
  if (previousVideo && previousVideo !== nextVideo) previousVideo.pause();
  playbackSubscribers.forEach((subscriber) => subscriber());
}

function updatePlaybackParticipant(
  video: HTMLVideoElement,
  eligible: boolean,
  visibilityRatio = 0,
) {
  const currentState = playbackParticipants.get(video);
  if (
    currentState?.eligible === eligible &&
    currentState.visibilityRatio === visibilityRatio
  ) {
    return;
  }

  playbackParticipants.set(video, { eligible, visibilityRatio });
  publishActivePlaybackVideo(selectActivePlaybackVideo());
}

function removePlaybackParticipant(video: HTMLVideoElement) {
  if (!playbackParticipants.delete(video)) return;
  publishActivePlaybackVideo(selectActivePlaybackVideo());
}

function subscribeToPlaybackChanges(subscriber: () => void) {
  playbackSubscribers.add(subscriber);
  return () => {
    playbackSubscribers.delete(subscriber);
  };
}

function getActivePlaybackVideo() {
  return activePlaybackVideo;
}

function getServerPlaybackVideo() {
  return null;
}

type HomeHeroBackdropProps = {
  variant?: "home" | "coaching";
  videoSource?: string;
  posterSource?: string;
  controlPlacement?: "viewport" | "section-bottom";
  onEntryMotionAllowedChange?: (allowed: boolean) => void;
  onMotionActiveChange?: (active: boolean) => void;
  onMotionPause?: () => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: EventTarget & { saveData?: boolean };
};

function isAbortError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

function subscribeToPreference(
  query: MediaQueryList | undefined,
  listener: () => void,
) {
  if (!query) return () => undefined;

  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
}

export function HomeHeroBackdrop({
  variant = "home",
  videoSource = VIDEO_SOURCE,
  posterSource = POSTER_SOURCE,
  controlPlacement = "viewport",
  onEntryMotionAllowedChange,
  onMotionActiveChange,
  onMotionPause,
}: HomeHeroBackdropProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = useSyncExternalStore(
    subscribeToPlaybackChanges,
    getActivePlaybackVideo,
    getServerPlaybackVideo,
  );
  const firstFrameTimerRef = useRef<number | null>(null);
  const playbackAttemptRef = useRef(0);
  const resumeTimeRef = useRef<number | null>(null);
  const failedRef = useRef(false);
  const requiresSectionControlVisibility =
    variant === "coaching" && controlPlacement === "section-bottom";
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [intersectionObserverAvailable, setIntersectionObserverAvailable] =
    useState(false);
  const [stageInView, setStageInView] = useState(false);
  const [stageVisibilityReady, setStageVisibilityReady] = useState(false);
  const [stageVisibilityRatio, setStageVisibilityRatio] = useState(0);
  const [sectionControlVisible, setSectionControlVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [videoMetadataReady, setVideoMetadataReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const controlAccessible =
    !requiresSectionControlVisibility || sectionControlVisible;
  const playbackEligible =
    motionAllowed &&
    stageInView &&
    pageVisible &&
    !mediaFailed;

  const clearFirstFrameTimer = useCallback(() => {
    if (firstFrameTimerRef.current === null) return;
    window.clearTimeout(firstFrameTimerRef.current);
    firstFrameTimerRef.current = null;
  }, []);

  const usePosterFallback = useCallback(() => {
    if (failedRef.current) return;
    failedRef.current = true;
    onEntryMotionAllowedChange?.(false);
    playbackAttemptRef.current += 1;
    clearFirstFrameTimer();
    setMediaFailed(true);
    setMediaReady(false);
    setVideoMetadataReady(false);
    setVideoStarted(false);
    resumeTimeRef.current = null;

    const video = videoRef.current;
    if (!video) return;
    updatePlaybackParticipant(video, false);
    video.pause();
    video.removeAttribute("src");
    video.load();
  }, [clearFirstFrameTimer, onEntryMotionAllowedChange]);

  const requestVideoPlay = useCallback(
    (video: HTMLVideoElement) => {
      if (activePlaybackVideo !== video || !video.paused) return;
      const attempt = ++playbackAttemptRef.current;
      const handleRejection = (error: unknown) => {
        if (playbackAttemptRef.current !== attempt || isAbortError(error)) {
          return;
        }
        usePosterFallback();
      };

      try {
        void video.play().then(() => {
          if (
            playbackAttemptRef.current !== attempt ||
            activePlaybackVideo !== video
          ) {
            video.pause();
          }
        }).catch(handleRejection);
      } catch (error) {
        handleRejection(error);
      }
    },
    [usePosterFallback],
  );

  const pauseVideo = useCallback((video: HTMLVideoElement) => {
    playbackAttemptRef.current += 1;
    video.pause();
  }, []);

  const markMediaReady = useCallback(() => {
    if (failedRef.current) return;
    clearFirstFrameTimer();
    setMediaReady(true);
  }, [clearFirstFrameTimer]);

  useEffect(() => {
    const reducedMotion =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : undefined;
    const reducedData =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-data: reduce)")
        : undefined;
    const connection = (navigator as NavigatorWithConnection).connection;
    const updateMotionPermission = () => {
      const allowed =
        !reducedMotion?.matches &&
          !reducedData?.matches &&
          connection?.saveData !== true;
      setMotionAllowed(allowed);
      setMotionPreferenceReady(true);
    };

    updateMotionPermission();
    const removeMotionListener = subscribeToPreference(
      reducedMotion,
      updateMotionPermission,
    );
    const removeDataListener = subscribeToPreference(
      reducedData,
      updateMotionPermission,
    );
    connection?.addEventListener("change", updateMotionPermission);

    return () => {
      removeMotionListener();
      removeDataListener();
      connection?.removeEventListener("change", updateMotionPermission);
    };
  }, [onEntryMotionAllowedChange]);

  useEffect(() => {
    if (!motionPreferenceReady || !stageVisibilityReady) return;
    onEntryMotionAllowedChange?.(
      motionAllowed &&
        stageInView &&
        pageVisible &&
        controlAccessible &&
        !userPaused &&
        !mediaFailed,
    );
  }, [
    mediaFailed,
    controlAccessible,
    motionAllowed,
    motionPreferenceReady,
    onEntryMotionAllowedChange,
    pageVisible,
    stageInView,
    stageVisibilityReady,
    userPaused,
  ]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateSectionControlVisibility = () => {
      if (!requiresSectionControlVisibility) return;

      const rect = stage.getBoundingClientRect();
      const rootFontSize =
        Number.parseFloat(
          window.getComputedStyle(document.documentElement).fontSize,
        ) || 16;
      const controlSize = SECTION_CONTROL_SIZE_REM * rootFontSize;
      const inset = SECTION_CONTROL_INSET_REM * rootFontSize;
      const controlTop = rect.bottom - inset - controlSize;
      const controlRight = rect.right - inset;
      const controlBottom = rect.bottom - inset;
      const controlLeft = controlRight - controlSize;
      const visible =
        rect.width > 0 &&
        rect.height > 0 &&
        controlTop >= HEADER_BOTTOM_PX + inset &&
        controlLeft >= 0 &&
        controlRight <= window.innerWidth &&
        controlBottom <= window.innerHeight;

      setSectionControlVisible(visible);
    };

    if (requiresSectionControlVisibility) {
      updateSectionControlVisibility();
      window.addEventListener("scroll", updateSectionControlVisibility, {
        passive: true,
      });
      window.addEventListener("resize", updateSectionControlVisibility);
    }

    const removeSectionControlListeners = () => {
      if (!requiresSectionControlVisibility) return;
      window.removeEventListener("scroll", updateSectionControlVisibility);
      window.removeEventListener("resize", updateSectionControlVisibility);
    };

    if (typeof IntersectionObserver === "undefined") {
      setIntersectionObserverAvailable(false);
      const updateStageVisibility = () => {
        const rect = stage.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
        );
        const visibilityRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
        setStageInView(visibilityRatio > 0);
        setStageVisibilityRatio(visibilityRatio);
        setStageVisibilityReady(true);
        updateSectionControlVisibility();
      };

      updateStageVisibility();
      window.addEventListener("scroll", updateStageVisibility, {
        passive: true,
      });
      window.addEventListener("resize", updateStageVisibility);
      return () => {
        window.removeEventListener("scroll", updateStageVisibility);
        window.removeEventListener("resize", updateStageVisibility);
        removeSectionControlListeners();
      };
    }

    setIntersectionObserverAvailable(true);
    const observer = new IntersectionObserver(([entry]) => {
      setStageInView(entry.isIntersecting);
      setStageVisibilityRatio(entry.intersectionRatio);
      setStageVisibilityReady(true);
      updateSectionControlVisibility();
    }, { threshold: [0, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1] });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      removeSectionControlListeners();
    };
  }, [requiresSectionControlVisibility]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    updatePlaybackParticipant(
      video,
      playbackEligible,
      stageVisibilityRatio,
    );

    if (!motionAllowed || mediaFailed) {
      pauseVideo(video);
      if (video.hasAttribute("src")) {
        if (resumeTimeRef.current === null) {
          resumeTimeRef.current = video.currentTime;
        }
        video.removeAttribute("src");
        video.load();
        setVideoMetadataReady(false);
        setVideoStarted(false);
      }
      clearFirstFrameTimer();
      setMediaReady(false);
      return;
    }

    if (!stageInView || !pageVisible || !controlAccessible) {
      pauseVideo(video);
      clearFirstFrameTimer();
      return;
    }

    if (activeVideo !== video) {
      pauseVideo(video);
      clearFirstFrameTimer();
      return;
    }

    if (video.getAttribute("src") !== videoSource) {
      video.setAttribute("src", videoSource);
      video.load();
      setVideoMetadataReady(false);
    }

    if (userPaused) {
      pauseVideo(video);
      clearFirstFrameTimer();
      return;
    }

    if (!mediaReady && firstFrameTimerRef.current === null) {
      firstFrameTimerRef.current = window.setTimeout(
        usePosterFallback,
        5000,
      );
    }

    if (resumeTimeRef.current !== null) {
      if (!videoMetadataReady || !Number.isFinite(video.duration)) return;
      const latestSafeTime = Math.max(0, video.duration - 0.05);
      video.currentTime = Math.min(resumeTimeRef.current, latestSafeTime);
      resumeTimeRef.current = null;
    }

    requestVideoPlay(video);
  }, [
    activeVideo,
    clearFirstFrameTimer,
    controlAccessible,
    mediaFailed,
    mediaReady,
    motionAllowed,
    pageVisible,
    pauseVideo,
    playbackEligible,
    requestVideoPlay,
    stageInView,
    stageVisibilityRatio,
    usePosterFallback,
    userPaused,
    videoMetadataReady,
    videoSource,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      playbackAttemptRef.current += 1;
      clearFirstFrameTimer();
      if (video) {
        video.pause();
        removePlaybackParticipant(video);
      }
    };
  }, [clearFirstFrameTimer]);

  const motionActive =
    motionAllowed &&
    stageInView &&
    pageVisible &&
    controlAccessible &&
    !userPaused &&
    !mediaFailed;

  useEffect(() => {
    onMotionActiveChange?.(motionActive);
  }, [motionActive, onMotionActiveChange]);

  const toggleMotion = () => {
    const video = videoRef.current;
    if (userPaused) {
      setUserPaused(false);
      return;
    }

    setUserPaused(true);
    onMotionPause?.();
    if (video) pauseVideo(video);
  };

  return (
    <>
      <div
        ref={stageRef}
        className={`${styles.backdrop} ${variant === "coaching" ? styles.coachingBackdrop : ""}`}
        data-video-visible={videoStarted && !mediaFailed}
        aria-hidden="true"
      >
        <object
          className={styles.posterFallback}
          data={posterSource}
          type="image/jpeg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <object
            className={styles.posterFallbackSecondary}
            data="/images/home-opening-sunshine.png"
            type="image/png"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className={styles.posterFallbackEmpty} aria-hidden="true" />
          </object>
        </object>
        <video
          ref={videoRef}
          className={styles.video}
          poster={posterSource}
          muted
          playsInline
          loop
          preload="none"
          tabIndex={-1}
          onLoadedMetadata={(event) => {
            if (event.currentTarget.getAttribute("src") !== videoSource) return;
            setVideoMetadataReady(true);
          }}
          onLoadedData={(event) => {
            if (event.currentTarget.getAttribute("src") !== videoSource) return;
            markMediaReady();
          }}
          onPlaying={(event) => {
            const video = event.currentTarget;
            if (
              video.getAttribute("src") !== videoSource ||
              video.paused
            ) {
              return;
            }
            if (activePlaybackVideo !== video) {
              pauseVideo(video);
              return;
            }
            markMediaReady();
            setVideoStarted(true);
          }}
          onError={(event) => {
            if (event.currentTarget.getAttribute("src") !== videoSource) {
              return;
            }
            if (event.currentTarget.error?.code === MediaError.MEDIA_ERR_ABORTED) {
              return;
            }
            usePosterFallback();
          }}
        />
        <div
          className={`${styles.scrim} ${variant === "coaching" ? styles.coachingScrim : ""}`}
        />
      </div>

      {motionAllowed &&
        !mediaFailed &&
        controlAccessible &&
        (variant !== "coaching" || (stageInView && activeVideo === videoRef.current)) && (
        <button
          type="button"
          className={`${styles.motionControl} ${variant === "coaching" ? styles.coachingMotionControl : ""} ${variant === "coaching" && controlPlacement === "section-bottom" ? styles.coachingMotionControlBottom : ""}`}
          aria-label={userPaused ? "Bật chuyển động" : "Tạm dừng chuyển động"}
          onClick={toggleMotion}
          onFocus={onMotionPause}
        >
          <span className={styles.motionIconSlot} aria-hidden="true">
            <Pause
              size={18}
              className={`${styles.motionIcon} ${intersectionObserverAvailable ? "" : styles.motionIconStatic} ${userPaused ? styles.motionIconHidden : styles.motionIconVisible}`}
            />
            <Play
              size={18}
              className={`${styles.motionIcon} ${intersectionObserverAvailable ? "" : styles.motionIconStatic} ${userPaused ? styles.motionIconVisible : styles.motionIconHidden}`}
            />
          </span>
        </button>
      )}
    </>
  );
}
