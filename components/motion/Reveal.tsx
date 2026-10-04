"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { durations, easeOutExpo } from "@/lib/motion";

const elements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} as const;

type RevealProps = {
  children: ReactNode;
  as?: keyof typeof elements;
  /** Seconds. Use small steps (e.g. 0.08) to stagger siblings. */
  delay?: number;
  /** Vertical travel in px. Ignored under reduced motion. */
  y?: number;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
  className?: string;
  id?: string;
};

/**
 * Fades and lifts content into view once. Use below the fold only:
 * content above the fold should render immediately for LCP.
 * The data-reveal hook lets the <noscript> rule in the root layout keep content visible without JS.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  amount = 0.25,
  className,
  id,
}: RevealProps) {
  const Component = elements[as];
  return (
    <Component
      id={id}
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: durations.slow, delay, ease: easeOutExpo }}
    >
      {children}
    </Component>
  );
}
