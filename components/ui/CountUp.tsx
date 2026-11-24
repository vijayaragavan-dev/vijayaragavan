"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";

type CountUpProps = {
  value: number;
  duration?: number;
  className?: string;
};

export default function CountUp({ value, duration = 1300, className }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const reduceMotion = useReducedMotionPreference();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {reduceMotion ? value : display}
    </span>
  );
}
