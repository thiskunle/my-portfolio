"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Phase = "hold" | "out" | "gap" | "in";

const HOLD_MS = 2500;
const GAP_MS = 250;
const wipeEase = [0.45, 0, 0.25, 1] as const;

type RoleRotatorProps = {
  prefix: string;
  roles: readonly string[];
};

/**
 * Clip-wipe role reveal carried over from the original site: each role is uncovered
 * left to right behind a caret, held, then wiped back.
 *
 * - Screen readers get one static sentence listing every role; the animation is aria-hidden.
 * - Every role is laid out invisibly in the same cell, so the line reserves the width and
 *   height of the longest role and nothing around it shifts.
 * - Runs only while on screen and the tab is visible. The pause control satisfies WCAG 2.2.2
 *   and also pauses the hero floor (via :has([data-motion-paused]) in globals.css) and the
 *   decorative hero video.
 * - Reduced motion: no rotation; the roles are shown as a static list (CSS motion-reduce).
 */
export function RoleRotator({ prefix, roles }: RoleRotatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.5 });
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("hold");
  const [paused, setPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const running = !paused && !reduceMotion && inView && !pageHidden;

  // Timed phases. Animated phases ("out", "in") advance from onAnimationComplete.
  // Only hold → out waits on `running`, so pausing mid-cycle always settles on a fully
  // revealed role rather than an empty line.
  useEffect(() => {
    if (phase === "hold" && running) {
      const timer = setTimeout(() => setPhase("out"), HOLD_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "gap") {
      const timer = setTimeout(() => setPhase("in"), GAP_MS);
      return () => clearTimeout(timer);
    }
  }, [running, phase]);

  function onWipeComplete() {
    if (phase === "out") {
      setIndex((current) => (current + 1) % roles.length);
      setPhase("gap");
    } else if (phase === "in") {
      setPhase("hold");
    }
  }

  const hidden = phase === "out" || phase === "gap";
  const last = roles[roles.length - 1];
  const spoken = `${prefix} ${roles.slice(0, -1).join(", ")}, and ${last}.`;

  return (
    <div ref={ref} className="mt-4 flex items-center gap-4">
      <p className="font-display text-role font-bold text-ink">
        <span className="sr-only">{spoken}</span>

        {/* Animated line */}
        <span aria-hidden className="flex items-center gap-[0.3em] motion-reduce:hidden">
          <span>{prefix}</span>
          <span className="inline-grid">
            {roles.map((role) => (
              <span
                key={role}
                className="invisible col-start-1 row-start-1 pr-2 whitespace-nowrap"
              >
                {role}.
              </span>
            ))}
            <span className="col-start-1 row-start-1 flex items-center">
              <motion.span
                className="block h-[1.2em] overflow-hidden whitespace-nowrap"
                initial={false}
                animate={{ width: hidden ? 0 : "auto" }}
                transition={{ duration: phase === "out" ? 0.5 : 0.6, ease: wipeEase }}
                onAnimationComplete={onWipeComplete}
              >
                {roles[index]}.
              </motion.span>
              <span
                className={cn(
                  "ml-0.5 block h-[1.05em] w-[3px] shrink-0 bg-forest",
                  running && phase === "hold" && "motion-safe:animate-caret",
                )}
              />
            </span>
          </span>
        </span>

        {/* Reduced motion: static list */}
        <span aria-hidden className="hidden text-lead leading-snug font-semibold text-ink-2 motion-reduce:block">
          {roles.join(" · ")}
        </span>
      </p>

      <button
        type="button"
        onClick={() => {
          const next = !paused;
          setPaused(next);
          // The same control pauses the hero's decorative video (the floor pauses via CSS :has()).
          ref.current
            ?.closest("section")
            ?.querySelectorAll("video")
            .forEach((video) => {
              if (next) video.pause();
              else video.play().catch(() => {});
            });
        }}
        data-motion-paused={paused ? "" : undefined}
        aria-label={paused ? "Play hero animation" : "Pause hero animation"}
        className="grid size-9 shrink-0 place-items-center rounded-full text-sm text-ink-2 ring-1 ring-line ring-inset transition-colors duration-200 hover:text-ink hover:ring-ink motion-reduce:hidden"
      >
        <Icon name={paused ? "play" : "pause"} />
      </button>
    </div>
  );
}
