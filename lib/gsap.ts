"use client";

/**
 * Single GSAP entry point. Every component imports gsap and its plugins from here so the
 * plugins are registered exactly once, and only in the browser.
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, useGSAP);
  gsap.defaults({ ease: "power4.out", duration: 1 });
}

/** True when the visitor asked the OS for reduced motion. Read at call time, never cached. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { Draggable, gsap, ScrollTrigger, useGSAP };
