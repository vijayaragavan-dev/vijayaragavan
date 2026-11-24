"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";
import { setLenisInstance } from "@/lib/lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reducedMotion) {
      setLenisInstance(null);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    setLenisInstance(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
