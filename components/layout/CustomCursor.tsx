"use client";

import { motion, useSpring } from "framer-motion";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { usePointer } from "@/hooks/usePointer";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";

export default function CustomCursor() {
  const { tier } = useDeviceTier();
  const reduced = useReducedMotionPreference();
  const enabled = tier === "full" && !reduced;
  const { x, y } = usePointer(enabled, -600);
  const springX = useSpring(x, { stiffness: 160, damping: 26, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 160, damping: 26, mass: 0.5 });

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="cursor-glow"
      style={{ x: springX, y: springY }}
    />
  );
}
