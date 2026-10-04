"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { durations, easeOutExpo } from "@/lib/motion";

/**
 * Site-wide Motion defaults.
 * reducedMotion="user": when the OS requests reduced motion, transform and layout
 * animations are skipped and only opacity/color transitions run.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: durations.base, ease: easeOutExpo }}>
      {children}
    </MotionConfig>
  );
}
