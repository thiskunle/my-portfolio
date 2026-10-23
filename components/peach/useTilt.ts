"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Tilts (and optionally enlarges) the referenced element toward the pointer while it hovers.
 * Mouse, trackpad and pen only (touch has no hover), and never under reduced motion. Put it on
 * an element whose own transform nothing else animates, e.g. an inner wrapper inside a
 * scroll-animated card.
 */
export function useTilt<T extends HTMLElement>(maxDegrees = 8, hoverScale = 1) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    gsap.set(el, { transformPerspective: 900 });
    const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
    const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
    const scale = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = el.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width - 0.5;
      const py = (event.clientY - box.top) / box.height - 0.5;
      rotateY(px * maxDegrees * 2);
      rotateX(-py * maxDegrees * 2);
      scale(hoverScale);
    };
    const onLeave = () => {
      rotateX(0);
      rotateY(0);
      scale(1);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [maxDegrees, hoverScale]);

  return ref;
}
