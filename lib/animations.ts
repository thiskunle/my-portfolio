"use client";

import { gsap } from "@/lib/gsap";

/**
 * Shared scroll animations for the showcase sections. Call them inside useGSAP() so they are
 * scoped to the section and reverted on unmount. Callers skip them under reduced motion;
 * the CSS start states in app/globals.css are disabled then too.
 */

/** Draws every <Scribble> underline inside root as it scrolls into view. */
export function drawScribbles(root: Element) {
  gsap.utils.toArray<SVGPathElement>(".gb-scribble path", root).forEach((path) => {
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
      scrollTrigger: { trigger: path, start: "top 85%" },
    });
  });
}

/** Fades and lifts targets into place once trigger reaches the lower part of the viewport. */
export function riseIn(
  targets: gsap.TweenTarget,
  trigger: Element,
  vars: gsap.TweenVars = {},
) {
  return gsap.from(targets, {
    y: 40,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 1,
    scrollTrigger: { trigger, start: "top 80%" },
    ...vars,
  });
}
