"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./HomeHeroBackdrop.module.css";

const VIDEO_SOURCE = "/videos/home-fansipan-0147-loop.mp4";
const POSTER_SOURCE = "/images/home-fansipan-0147-poster.jpg";

type HomeHeroBackdropProps = {
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
  onEntryMotionAllowedChange,
  onMotionActiveChange,
  onMotionPause,
}: HomeHeroBackdropProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstFrameTimerRef = useRef<number | null>(null);
  const playbackAttemptRef = useRef(0);
  const resumeTimeRef = useRef<number | null>(null);
  const failedRef = useRef(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [stageInView, setStageInView] = useState(false);
  const [stageVisibilityReady, setStageVisibilityReady] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [videoMetadataReady, setVideoMetadataReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

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
    video.pause();
    video.removeAttribute("src");
    video.load();
  }, [clearFirstFrameTimer, onEntryMotionAllowedChange]);

  const requestVideoPlay = useCallback(
    (video: HTMLVideoElement) => {
      const attempt = ++playbackAttemptRef.current;
      const handleRejection = (error: unknown) => {
        if (playbackAttemptRef.current !== attempt || isAbortError(error)) {
          return;
        }
        usePosterFallback();
      };

      try {
        void video.play().catch(handleRejection);
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
        !userPaused &&
        !mediaFailed,
    );
  }, [
    mediaFailed,
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

    if (typeof IntersectionObserver === "undefined") {
      const updateStageVisibility = () => {
        const rect = stage.getBoundingClientRect();
        setStageInView(rect.bottom > 0 && rect.top < window.innerHeight);
        setStageVisibilityReady(true);
      };

      updateStageVisibility();
      window.addEventListener("scroll", updateStageVisibility, {
        passive: true,
      });
      window.addEventListener("resize", updateStageVisibility);
      return () => {
        window.removeEventListener("scroll", updateStageVisibility);
        window.removeEventListener("resize", updateStageVisibility);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      setStageInView(entry.isIntersecting);
      setStageVisibilityReady(true);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

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

    if (!stageInView || !pageVisible) {
      pauseVideo(video);
      clearFirstFrameTimer();
      return;
    }

    if (video.getAttribute("src") !== VIDEO_SOURCE) {
      video.setAttribute("src", VIDEO_SOURCE);
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
    clearFirstFrameTimer,
    mediaFailed,
    mediaReady,
    motionAllowed,
    pageVisible,
    pauseVideo,
    requestVideoPlay,
    stageInView,
    usePosterFallback,
    userPaused,
    videoMetadataReady,
  ]);

  useEffect(() => {
    return () => {
      playbackAttemptRef.current += 1;
      clearFirstFrameTimer();
    };
  }, [clearFirstFrameTimer]);

  const motionActive =
    motionAllowed &&
    stageInView &&
    pageVisible &&
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
        className={styles.backdrop}
        data-video-visible={videoStarted && !mediaFailed}
        aria-hidden="true"
      >
        <object
          className={styles.posterFallback}
          data={POSTER_SOURCE}
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
          poster={POSTER_SOURCE}
          muted
          playsInline
          loop
          preload="none"
          tabIndex={-1}
          onLoadedMetadata={(event) => {
            if (event.currentTarget.getAttribute("src") !== VIDEO_SOURCE) return;
            setVideoMetadataReady(true);
          }}
          onLoadedData={(event) => {
            if (event.currentTarget.getAttribute("src") !== VIDEO_SOURCE) return;
            markMediaReady();
          }}
          onPlaying={(event) => {
            const video = event.currentTarget;
            if (
              video.getAttribute("src") !== VIDEO_SOURCE ||
              video.paused
            ) {
              return;
            }
            markMediaReady();
            setVideoStarted(true);
          }}
          onError={(event) => {
            if (event.currentTarget.getAttribute("src") !== VIDEO_SOURCE) {
              return;
            }
            if (event.currentTarget.error?.code === MediaError.MEDIA_ERR_ABORTED) {
              return;
            }
            usePosterFallback();
          }}
        />
        <div className={styles.scrim} />
      </div>

      {motionAllowed && !mediaFailed && (
        <button
          type="button"
          className={styles.motionControl}
          aria-label={userPaused ? "Bật chuyển động" : "Tạm dừng chuyển động"}
          onClick={toggleMotion}
          onFocus={onMotionPause}
        >
          {userPaused ? (
            <Play size={18} aria-hidden="true" />
          ) : (
            <Pause size={18} aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
