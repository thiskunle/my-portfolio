"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/** Matches --header-h in app/globals.css, so anchor targets clear the fixed header. */
const HEADER_OFFSET = -72;

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger animations stay in sync.
 * Skipped entirely under reduced motion: the page keeps native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      // Lenis handles in-page links itself (header nav, CTAs) with the same easing as the wheel.
      anchors: { offset: HEADER_OFFSET },
      // Let modal dialogs (project details) scroll natively.
      prevent: (node) => node.closest("dialog") !== null,
    });
    const raf = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
