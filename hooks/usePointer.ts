"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

export function usePointer(enabled = true, initialPosition = 0) {
  const x = useMotionValue(initialPosition);
  const y = useMotionValue(initialPosition);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let frame = 0;
    let latestX = 0;
    let latestY = 0;

    const handleMove = (event: PointerEvent) => {
      latestX = event.clientX;
      latestY = event.clientY;

      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        x.set(latestX);
        y.set(latestY);
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, x, y]);

  return { x, y };
}
