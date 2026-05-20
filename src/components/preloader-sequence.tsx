"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Stage = "part1" | "part2" | "reveal" | "done";
type PreloaderLoadState = "loading" | "ready" | "failed";
type ViewportMode = "desktop" | "tablet" | "phone";

interface PreloaderSequenceProps {
  onComplete?: () => void;
}

const ASSET_VERSION = "20260519-fit-a";
const PART_ONE_DURATIONS_MS: Record<ViewportMode, number> = {
  desktop: 1278,
  phone: 1167,
  tablet: 1167,
};
const PART_TWO_DURATION_MS = 2720;
const PART_TWO_HANDOFF_SETTLE_MS = 780;
const REVEAL_DURATION_MS = 1150;
const SITE_READY_FALLBACK_MS = 14000;
const MEDIA_READY_STATE = 2;
const PHONE_PRELOADER_QUERY = "(max-width: 767px)";
const MOBILE_PRELOADER_QUERY =
  "(max-width: 1024px), ((pointer: coarse) and (max-width: 1180px))";
const PRELOADER_VIDEOS = {
  part1Desktop: `/preloader/preloader-1-loop-bg-fff9dc.mp4?v=${ASSET_VERSION}`,
  part1Phone: `/preloader/preloader-phone-bg-fff9dc.mp4?v=${ASSET_VERSION}`,
  part1Tablet: `/preloader/preloader-tab-bg-fff9dc.mp4?v=${ASSET_VERSION}`,
  part2: `/preloader/preloader-2-bg-1c7873.mp4?v=${ASSET_VERSION}`,
};
const STAGE_ORDER: Record<Stage, number> = {
  part1: 0,
  part2: 1,
  reveal: 2,
  done: 3,
};

function preloadVideo(src: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    const settle = () => {
      video.removeEventListener("loadeddata", handleLoad);
      video.removeEventListener("canplay", handleLoad);
      video.removeEventListener("error", handleError);
    };
    const handleLoad = () => {
      settle();
      resolve();
    };
    const handleError = () => {
      settle();
      resolve();
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.addEventListener("loadeddata", handleLoad, { once: true });
    video.addEventListener("canplay", handleLoad, { once: true });
    video.addEventListener("error", handleError, { once: true });
    video.src = src;
    video.load();
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  }

  return new Promise((resolve) => {
    const settle = () => {
      image.removeEventListener("load", settle);
      image.removeEventListener("error", settle);
      resolve();
    };

    image.addEventListener("load", settle, { once: true });
    image.addEventListener("error", settle, { once: true });
  });
}

function waitForVideo(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= MEDIA_READY_STATE) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const settle = () => {
      video.removeEventListener("loadeddata", settle);
      video.removeEventListener("canplay", settle);
      video.removeEventListener("error", settle);
      resolve();
    };

    video.addEventListener("loadeddata", settle, { once: true });
    video.addEventListener("canplay", settle, { once: true });
    video.addEventListener("error", settle, { once: true });
  });
}

function waitForPresentedVideoFrame(
  video: HTMLVideoElement,
  fallbackMs = 180,
): Promise<void> {
  const videoWithFrameCallback = video as HTMLVideoElement & {
    requestVideoFrameCallback?: (callback: () => void) => number;
  };

  if (typeof videoWithFrameCallback.requestVideoFrameCallback !== "function") {
    return wait(80);
  }

  return new Promise((resolve) => {
    const fallbackTimer = window.setTimeout(resolve, fallbackMs);

    videoWithFrameCallback.requestVideoFrameCallback(() => {
      window.clearTimeout(fallbackTimer);
      resolve();
    });
  });
}

async function waitForPageAssets(): Promise<void> {
  if (document.readyState !== "complete") {
    await new Promise<void>((resolve) => {
      window.addEventListener("load", () => resolve(), { once: true });
    });
  }

  await document.fonts?.ready.catch(() => undefined);

  // Only block on media the browser would have fetched eagerly anyway.
  // Lazy/offscreen images and videos with preload="none"/"metadata" must not
  // hold the preloader open — they're explicitly deferred for a reason.
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>("img:not(.preloader__asset)"),
  ).filter((image) => image.loading !== "lazy");
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>("video:not(.preloader__asset)"),
  ).filter((video) => video.preload !== "none" && video.preload !== "metadata");

  await Promise.all([
    ...images.map((image) => waitForImage(image)),
    ...videos.map((video) => waitForVideo(video)),
  ]);
}

export function PreloaderSequence({ onComplete }: PreloaderSequenceProps) {
  const partOneVideoRef = useRef<HTMLVideoElement>(null);
  const partTwoVideoRef = useRef<HTMLVideoElement>(null);
  const completionLockedRef = useRef(false);
  const siteReadyRef = useRef(false);
  const stageRef = useRef<Stage>("part1");
  const isCompactViewportRef = useRef(false);
  const partOneRotationLockedRef = useRef(false);
  const [siteReady, setSiteReady] = useState(false);
  const [stage, setStage] = useState<Stage>("part1");
  const [partOneRotation, setPartOneRotation] = useState(0);
  const [isPartTwoPrimed, setIsPartTwoPrimed] = useState(false);
  const [isPartTwoSettled, setIsPartTwoSettled] = useState(false);
  const [loadState, setLoadState] = useState<PreloaderLoadState>("loading");
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode | null>(null);

  const advanceStage = useCallback((nextStage: Stage) => {
    setStage((current) =>
      STAGE_ORDER[nextStage] > STAGE_ORDER[current] ? nextStage : current,
    );
  }, []);

  const completeSequence = useCallback(() => {
    if (completionLockedRef.current) {
      return;
    }

    completionLockedRef.current = true;
    advanceStage("done");
    onComplete?.();
  }, [advanceStage, onComplete]);

  const playVideo = useCallback((video: HTMLVideoElement | null) => {
    if (!video) {
      return;
    }

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch((error) => {
        if (
          error instanceof DOMException &&
          (error.name === "AbortError" ||
            error.name === "NotSupportedError" ||
            error.message.includes("paused to save power"))
        ) {
          return;
        }

        console.warn("Preloader video playback skipped:", error);
      });
    }
  }, []);

  const preparePartTwoAndAdvance = useCallback(async () => {
    const video = partTwoVideoRef.current;

    if (video) {
      video.currentTime = 0;
      await Promise.race([waitForVideo(video), wait(450)]).catch(() => undefined);
    }

    advanceStage("part2");
  }, [advanceStage]);

  const selectedPartOneSrc =
    viewportMode === "phone"
      ? PRELOADER_VIDEOS.part1Phone
      : viewportMode === "tablet"
        ? PRELOADER_VIDEOS.part1Tablet
        : viewportMode === "desktop"
          ? PRELOADER_VIDEOS.part1Desktop
          : undefined;
  const selectedPartOneDurationMs = viewportMode
    ? PART_ONE_DURATIONS_MS[viewportMode]
    : PART_ONE_DURATIONS_MS.desktop;
  const isCompactViewport = viewportMode !== null && viewportMode !== "desktop";
  const selectedPartTwoSrc = viewportMode === "desktop" ? PRELOADER_VIDEOS.part2 : undefined;

  useEffect(() => {
    siteReadyRef.current = siteReady;
  }, [siteReady]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    if (stage === "done") {
      delete document.documentElement.dataset.preloaderActive;
      delete document.body.dataset.preloaderActive;
      return;
    }

    document.documentElement.dataset.preloaderActive = "true";
    document.body.dataset.preloaderActive = "true";

    return () => {
      delete document.documentElement.dataset.preloaderActive;
      delete document.body.dataset.preloaderActive;
    };
  }, [stage]);

  useEffect(() => {
    const phoneQuery = window.matchMedia(PHONE_PRELOADER_QUERY);
    const mobileQuery = window.matchMedia(MOBILE_PRELOADER_QUERY);
    const syncViewportMode = () => {
      const nextViewportMode: ViewportMode =
        phoneQuery.matches || window.innerWidth <= 767
          ? "phone"
          : mobileQuery.matches || window.innerWidth <= 1024
            ? "tablet"
            : "desktop";

      isCompactViewportRef.current = nextViewportMode !== "desktop";
      window.setTimeout(() => setViewportMode(nextViewportMode), 0);
    };
    syncViewportMode();

    phoneQuery.addEventListener("change", syncViewportMode);
    mobileQuery.addEventListener("change", syncViewportMode);
    window.addEventListener("resize", syncViewportMode);

    return () => {
      phoneQuery.removeEventListener("change", syncViewportMode);
      mobileQuery.removeEventListener("change", syncViewportMode);
      window.removeEventListener("resize", syncViewportMode);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const debugParam = params.get("preloaderDebug");
    const debugFromQuery = debugParam === "1";
    const disableFromQuery = debugParam === "0";
    const debugFromStorage = window.localStorage.getItem("preloaderDebug") === "1";
    const shouldEnableDebug = disableFromQuery ? false : debugFromQuery || debugFromStorage;

    if (debugFromQuery) {
      window.localStorage.setItem("preloaderDebug", "1");
    }

    if (disableFromQuery) {
      window.localStorage.removeItem("preloaderDebug");
    }

    window.setTimeout(() => setIsDebugEnabled(shouldEnableDebug), 0);
  }, []);

  useEffect(() => {
    if (!isDebugEnabled) {
      return;
    }

    console.info("[Preloader stage]", {
      stage,
      siteReady,
      loadState,
    });
  }, [isDebugEnabled, loadState, siteReady, stage]);

  useEffect(() => {
    if (!viewportMode) {
      return;
    }

    let isActive = true;
    const videosToPreload =
      viewportMode === "desktop"
        ? [PRELOADER_VIDEOS.part1Desktop, PRELOADER_VIDEOS.part2]
        : [
            viewportMode === "phone"
              ? PRELOADER_VIDEOS.part1Phone
              : PRELOADER_VIDEOS.part1Tablet,
          ];

    Promise.race([
      Promise.all(videosToPreload.map((src) => preloadVideo(src))),
      wait(1600),
    ])
      .then(() => {
        if (isActive) {
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (isActive) {
          setLoadState("failed");
          advanceStage("reveal");
        }
      });

    return () => {
      isActive = false;
    };
  }, [advanceStage, viewportMode]);

  useEffect(() => {
    let isActive = true;

    const fallbackTimer = window.setTimeout(() => {
      if (isActive) {
        setSiteReady(true);
      }
    }, SITE_READY_FALLBACK_MS);

    waitForPageAssets()
      .catch((error) => {
        console.error("Preloader page asset gate failed:", error);
      })
      .finally(() => {
        if (isActive) {
          window.clearTimeout(fallbackTimer);
          setSiteReady(true);
        }
      });

    return () => {
      isActive = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const handlePartOneEnded = useCallback(() => {
    if (partOneRotationLockedRef.current || stageRef.current !== "part1") {
      return;
    }

    partOneRotationLockedRef.current = true;

    if (siteReadyRef.current) {
      if (isCompactViewportRef.current) {
        advanceStage("reveal");
        return;
      }

      void preparePartTwoAndAdvance();
      return;
    }

    setPartOneRotation((rotation) => rotation + 1);
  }, [advanceStage, preparePartTwoAndAdvance]);

  useEffect(() => {
    if (stage !== "part1" || loadState === "loading") {
      return;
    }

    if (loadState === "failed") {
      window.setTimeout(() => advanceStage("reveal"), 0);
      return;
    }

    partOneRotationLockedRef.current = false;
    playVideo(partOneVideoRef.current);

    const timer = window.setTimeout(() => {
      handlePartOneEnded();
    }, selectedPartOneDurationMs + 180);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    advanceStage,
    handlePartOneEnded,
    loadState,
    partOneRotation,
    playVideo,
    selectedPartOneDurationMs,
    stage,
  ]);

  useEffect(() => {
    if (stage !== "part2") {
      return;
    }

    let isActive = true;
    let settleTimer: number | undefined;
    const partTwoVideo = partTwoVideoRef.current;

    playVideo(partTwoVideo);

    if (partTwoVideo) {
      void waitForPresentedVideoFrame(partTwoVideo).then(() => {
        if (!isActive) {
          return;
        }

        setIsPartTwoPrimed(true);
        settleTimer = window.setTimeout(() => {
          setIsPartTwoSettled(true);
        }, PART_TWO_HANDOFF_SETTLE_MS);
      });
    }

    const timer = window.setTimeout(() => {
      advanceStage("reveal");
    }, PART_TWO_DURATION_MS + 120);

    return () => {
      isActive = false;
      if (settleTimer) {
        window.clearTimeout(settleTimer);
      }
      window.clearTimeout(timer);
    };
  }, [advanceStage, playVideo, stage]);

  useEffect(() => {
    if (stage !== "reveal") {
      return;
    }

    const timer = window.setTimeout(() => {
      completeSequence();
    }, REVEAL_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [completeSequence, stage]);

  if (stage === "done") {
    return null;
  }

  const isPartOneVisible =
    stage === "part1" || (!isCompactViewport && stage === "part2" && !isPartTwoSettled);
  const isPartTwoVisible =
    !isCompactViewport && ((stage === "part2" && isPartTwoPrimed) || stage === "reveal");
  const isPartTwoStage = !isCompactViewport && (stage === "part2" || stage === "reveal");
  const debugText = `stage=${stage} | mode=${viewportMode ?? "detecting"} | pageAssets=${siteReady ? "ready" : "loading"} | preloader=${loadState}`;

  return (
    <div
      className={`preloader preloader--${stage} preloader--${viewportMode ?? "detecting"}`}
      data-part-two-teal={isPartTwoStage ? "true" : undefined}
      aria-live="polite"
    >
      <div className="preloader__media">
        <video
          aria-hidden={!isPartOneVisible}
          className={`preloader__asset preloader__video preloader__video--part1 ${isPartOneVisible ? "is-visible" : ""}`}
          muted
          onEnded={handlePartOneEnded}
          playsInline
          preload="auto"
          ref={partOneVideoRef}
          src={selectedPartOneSrc}
        />

        <video
          aria-hidden={!isPartTwoVisible}
          className={`preloader__asset preloader__video preloader__video--part2 ${isPartTwoVisible ? "is-visible" : ""}`}
          muted
          onEnded={() => advanceStage("reveal")}
          playsInline
          preload="auto"
          ref={partTwoVideoRef}
          src={selectedPartTwoSrc}
        />
      </div>

      {isDebugEnabled ? <p className="preloader__debug">{debugText}</p> : null}
    </div>
  );
}
