"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  enabled?: boolean;
};

export default function MagneticButton({
  children,
  className,
  strength = 10,
  enabled = false,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotionPreference();
  const active = enabled && !reduceMotion;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 22, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 260, damping: 22, mass: 0.35 });

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const ratioY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    rawX.set(ratioX * strength);
    rawY.set(ratioY * strength);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
