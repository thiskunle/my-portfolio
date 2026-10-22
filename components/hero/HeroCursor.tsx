"use client";

import { useEffect, useRef } from "react";

/** How far the aura ring closes the gap to the pointer each frame (0–1). */
const RING_FOLLOW = 0.16;
const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label";

/**
 * Glowing cursor dot with a trailing aura ring that grows over links and buttons. It replaces
 * the native cursor inside its parent section only, and only while a mouse, trackpad or pen is
 * in use (checked per event, since touchscreen laptops misreport their pointer type): the
 * section gets `data-custom-cursor` then, so without JS or on touch the normal cursor stays.
 */
export function HeroCursor() {
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = anchorRef.current?.parentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!section || !dot || !ring) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    let inside = false;
    let rafId = 0;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    function tick() {
      const follow = reduceMotion.matches ? 1 : RING_FOLLOW;
      ringPos.x += (pointer.x - ringPos.x) * follow;
      ringPos.y += (pointer.y - ringPos.y) * follow;
      place(ring!, ringPos.x, ringPos.y);
      rafId = requestAnimationFrame(tick);
    }

    function setVisible(visible: boolean) {
      if (visible === inside) return;
      inside = visible;
      dot!.dataset.visible = ring!.dataset.visible = String(visible);
      if (visible) section!.dataset.customCursor = "";
      else delete section!.dataset.customCursor;
      cancelAnimationFrame(rafId);
      if (visible) tick();
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType === "touch") {
        setVisible(false);
        return;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!inside) {
        // Start the ring under the pointer instead of sweeping in from the last exit point.
        ringPos.x = pointer.x;
        ringPos.y = pointer.y;
        setVisible(true);
      }
      place(dot!, pointer.x, pointer.y);
      const hovering = event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;
      ring!.dataset.hover = String(hovering);
    }

    const onLeave = () => setVisible(false);

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerdown", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      delete section.dataset.customCursor;
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerdown", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={anchorRef} aria-hidden="true" className="contents">
      <div
        ref={ringRef}
        data-visible="false"
        className="pointer-events-none fixed top-0 left-0 z-30 opacity-0 transition-opacity duration-200 data-[visible=true]:opacity-100"
      >
        <div className="-mt-5 -ml-5 size-10 rounded-full border border-white/60 shadow-[0_0_24px_rgba(255,255,255,0.35),inset_0_0_12px_rgba(255,255,255,0.15)] transition-[scale,background-color] duration-300 ease-out-expo in-data-[hover=true]:scale-160 in-data-[hover=true]:bg-white/10" />
      </div>
      <div
        ref={dotRef}
        data-visible="false"
        className="pointer-events-none fixed top-0 left-0 z-30 opacity-0 transition-opacity duration-200 data-[visible=true]:opacity-100"
      >
        <div className="-mt-1 -ml-1 size-2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.8)]" />
      </div>
    </span>
  );
}
