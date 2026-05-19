"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

type AutoplayVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "muted" | "playsInline"
>;

const MEDIA_HAVE_FUTURE_DATA = 3;

export function AutoplayVideo({ preload = "auto", ...rest }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => undefined);
      }
    };

    if (video.readyState >= MEDIA_HAVE_FUTURE_DATA) {
      tryPlay();
      return;
    }

    video.addEventListener("canplay", tryPlay, { once: true });
    video.addEventListener("loadeddata", tryPlay, { once: true });

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, []);

  return (
    <video
      {...rest}
      autoPlay
      muted
      playsInline
      preload={preload}
      ref={videoRef}
    />
  );
}
