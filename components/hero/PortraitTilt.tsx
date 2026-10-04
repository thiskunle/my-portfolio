"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Resting pose in degrees: a gentle three-quarter view on every device. */
const REST = { rotateX: 4, rotateY: -8 };
/** Extra rotation at the viewport edges. Restrained compared with the original (±18° / ±14°). */
const RANGE = { rotateX: 6, rotateY: 8 };
const spring = { stiffness: 140, damping: 22, mass: 0.6 };

/**
 * 3D stage for the founder visual. Children keep their own depth (translateZ), so tilting the
 * stage produces the chip parallax with no per-chip JavaScript.
 *
 * Pointer tracking runs only on hover-capable fine pointers, without reduced motion, and only
 * while the stage is on screen. Otherwise the stage holds its static resting pose.
 */
export function PortraitTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, spring);
  const y = useSpring(pointerY, spring);
  const rotateY = useTransform(x, (value) => REST.rotateY + value * 2 * RANGE.rotateY);
  const rotateX = useTransform(y, (value) => REST.rotateX - value * 2 * RANGE.rotateX);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };
    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [reduceMotion, inView, pointerX, pointerY]);

  return (
    <motion.div ref={ref} className={cn("transform-3d", className)} style={{ rotateX, rotateY }}>
      {children}
    </motion.div>
  );
}
