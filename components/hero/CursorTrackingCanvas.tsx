"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 64;
/** How far the displayed angle moves toward the cursor angle each frame (0–1). */
const RESPONSE_FACTOR = 0.26;
/** Cursor within this fraction of the smaller viewport side shows the forward-facing frame. */
const DEADZONE_RATIO = 0.12;
/** The frames' backdrop, recoloured to the site red by build_direction_frames.py (--gb-red). */
const HERO_BACKDROP = "#c8102e";
/** Face centre as a fraction of the frame's width/height. */
const FACE_X = 0.53;
const FACE_Y = 0.37;
/** On wide screens the frame is drawn this many times the hero height (cropping the empty
 * backdrop above the head), with the face centred at WIDE_ANCHOR_X / WIDE_FACE_AT. */
const WIDE_ZOOM = 1.3;
const WIDE_ANCHOR_X = 0.66;
const WIDE_FACE_AT = 0.45;
const WIDE_MIN_WIDTH = 1024;
/** On narrow screens the face sits at this fraction of the canvas height. */
const NARROW_FACE_AT = 0.55;
/** Width (fraction of the drawn frame) over which its side edges fade out. The backdrop is
 * flat and matches the page, so this only softens where the sweater is cut by the frame edge. */
const EDGE_FEATHER = 0.08;

const framePath = (name: string) => `/frames/${name}.webp`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** dir-NN frames are evenly spaced clockwise from straight up (see build_direction_frames.py). */
function frameForAngle(angle: number) {
  return Math.round((angle / (Math.PI * 2)) * FRAME_COUNT) % FRAME_COUNT;
}

function normalizeAngle(angle: number) {
  const twoPi = Math.PI * 2;
  return ((angle % twoPi) + twoPi) % twoPi;
}

function lerpAngle(current: number, target: number, factor: number) {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * factor;
}

/** Where the (portrait) frame is drawn inside a width × height canvas. */
function frameRect(width: number, height: number, imgW: number, imgH: number) {
  if (width >= WIDE_MIN_WIDTH && width > height) {
    // Landscape: large, beside the copy, cropping the backdrop above the head.
    const scale = (height * WIDE_ZOOM) / imgH;
    const w = imgW * scale;
    const h = imgH * scale;
    const x = Math.min(width * WIDE_ANCHOR_X - w * FACE_X, width - w);
    const y = Math.min(height * WIDE_FACE_AT - h * FACE_Y, 0);
    return { x, y, w, h };
  }
  // Narrow: cover the canvas width, with the face a little below centre.
  const scale = Math.max(width / imgW, height / imgH);
  const w = imgW * scale;
  const h = imgH * scale;
  const y = Math.min(Math.max(height * NARROW_FACE_AT - h * FACE_Y, height - h), 0);
  return { x: (width - w) / 2, y, w, h };
}

/**
 * Full-bleed canvas that turns the character's head toward the pointer by picking one of
 * 64 directional frames (public/frames/dir-00…63.webp, built by build_direction_frames.py)
 * from the pointer's angle around the face. Near the face, with reduced motion, or until a mouse, trackpad or pen moves (touch
 * screens have no hovering pointer to follow) it shows the forward-facing dir-center.webp; the
 * directional frames are only downloaded once there is such a pointer.
 */
export function CursorTrackingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    // A hint only: touchscreen laptops (e.g. Surface) report a coarse primary pointer even when
    // used with a trackpad, so any real mouse/pen movement also enables tracking.
    let hoveringPointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let center: HTMLImageElement | null = null;
    let frames: HTMLImageElement[] = [];
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let angle = 0;
    let visible = true;
    let rafId = 0;
    let cancelled = false;
    let framesRequested = false;

    const tracking = () =>
      hoveringPointer && !reduceMotion.matches && frames.length === FRAME_COUNT;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function pickImage() {
      if (!center) return null;
      if (!pointer || !tracking()) return center;

      const rect = canvas!.getBoundingClientRect();
      const box = frameRect(width, height, center.width, center.height);
      const dx = pointer.x - (rect.left + box.x + box.w * FACE_X);
      const dy = pointer.y - (rect.top + box.y + box.h * FACE_Y);
      if (Math.hypot(dx, dy) <= Math.min(width, height) * DEADZONE_RATIO) return center;

      // 0 = straight up, increasing clockwise.
      const target = normalizeAngle(Math.atan2(dy, dx) + Math.PI / 2);
      angle = normalizeAngle(lerpAngle(angle, target, RESPONSE_FACTOR));
      return frames[frameForAngle(angle)];
    }

    function draw() {
      ctx!.fillStyle = HERO_BACKDROP;
      ctx!.fillRect(0, 0, width, height);
      const img = pickImage();
      if (!img) return;
      const box = frameRect(width, height, img.width, img.height);
      ctx!.drawImage(img, box.x, box.y, box.w, box.h);
      if (box.w < width) featherEdges(box.x, box.w);
    }

    /** Fades the frame's left and right edges into the backdrop when it doesn't span the canvas. */
    function featherEdges(x: number, w: number) {
      const feather = w * EDGE_FEATHER;
      for (const [from, to] of [
        [x, x + feather],
        [x + w, x + w - feather],
      ]) {
        const gradient = ctx!.createLinearGradient(from, 0, to, 0);
        gradient.addColorStop(0, HERO_BACKDROP);
        gradient.addColorStop(1, `${HERO_BACKDROP}00`);
        ctx!.fillStyle = gradient;
        ctx!.fillRect(Math.min(from, to) - 1, 0, feather + 2, height);
      }
    }

    function loop() {
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function updateLoop() {
      cancelAnimationFrame(rafId);
      rafId = 0;
      if (visible && tracking()) loop();
      else draw();
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!hoveringPointer) {
        hoveringPointer = true;
        void loadFrames();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Skip work while the hero is scrolled out of view.
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateLoop();
    });
    intersectionObserver.observe(canvas);

    async function loadFrames() {
      if (framesRequested || !hoveringPointer) return;
      framesRequested = true;
      try {
        const loaded = await Promise.all(
          Array.from({ length: FRAME_COUNT }, (_, i) =>
            loadImage(framePath(`dir-${String(i).padStart(2, "0")}`)),
          ),
        );
        if (cancelled) return;
        frames = loaded;
        updateLoop();
      } catch (error) {
        console.error("Cursor-tracking hero: could not load frames", error);
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    reduceMotion.addEventListener("change", updateLoop);

    // Show the forward-facing frame as soon as it arrives; the directional frames follow.
    loadImage(framePath("dir-center"))
      .then((img) => {
        if (cancelled) return;
        center = img;
        draw();
        void loadFrames();
      })
      .catch((error) => console.error("Cursor-tracking hero: could not load frames", error));

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      reduceMotion.removeEventListener("change", updateLoop);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full"
      style={{ backgroundColor: HERO_BACKDROP }}
    />
  );
}
