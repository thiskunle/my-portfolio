"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/lib/content";
import { cn } from "@/lib/cn";
import {
  FACE_POSES,
  FACE_TRANSFORMS,
  SERVICE_FACES,
  slerp,
  toCssRotation,
  type Quat,
} from "./cubeMath";

const turnEase = [0.65, 0, 0.35, 1] as const;

type ServiceCubeProps = {
  services: readonly Pick<Service, "id" | "name" | "icon">[];
  activeIndex: number;
};

/**
 * Six-faced CSS 3D cube, one service per face. Purely visual (aria-hidden): the service list
 * carries the names, descriptions and selection state for assistive technology.
 *
 * Turning slerps from the cube's current orientation to the active face's pose, so an
 * interrupted turn continues smoothly from wherever it is. Reduced motion snaps directly.
 */
export function ServiceCube({ services, activeIndex }: ServiceCubeProps) {
  const reduceMotion = useReducedMotion();
  const initial = FACE_POSES[SERVICE_FACES[0]];
  const orientation = useRef<Quat>(initial);
  const transform = useMotionValue(toCssRotation(initial));

  useEffect(() => {
    const from = orientation.current;
    const to = FACE_POSES[SERVICE_FACES[activeIndex]];

    if (reduceMotion) {
      orientation.current = to;
      transform.set(toCssRotation(to));
      return;
    }

    const controls = animate(0, 1, {
      duration: 0.7,
      ease: turnEase,
      onUpdate: (t) => {
        const q = slerp(from, to, t);
        orientation.current = q;
        transform.set(toCssRotation(q));
      },
    });
    return () => controls.stop();
  }, [activeIndex, reduceMotion, transform]);

  return (
    <div
      aria-hidden
      className="relative grid h-[calc(var(--cube)*1.75)] w-full place-items-center perspective-[1400px] [--cube:10.5rem] sm:[--cube:13rem] lg:[--cube:clamp(15rem,22vw,19rem)]"
    >
      {/* Technical ground: fine grid fading out from the cube, plus a contact shadow. */}
      <div className="gb-grid-paper absolute inset-0 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="absolute bottom-[8%] h-[calc(var(--cube)*0.16)] w-[calc(var(--cube)*1.15)] rounded-[50%] bg-ink/15 blur-xl" />

      {/* Fixed three-quarter viewing angle; the cube rotates inside it. */}
      <div className="transform-3d [transform:rotateX(-14deg)_rotateY(-24deg)]">
        <motion.div
          className="relative size-[var(--cube)] transform-3d [--half:calc(var(--cube)/2)]"
          style={{ transform }}
        >
          {services.map((service, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={service.id}
                data-active={isActive || undefined}
                className={cn(
                  "absolute inset-0 flex flex-col overflow-hidden rounded-md bg-face p-[calc(var(--cube)*0.09)] text-face-ink backface-hidden",
                  "ring-1 ring-face-line ring-inset transition-[box-shadow] duration-500 data-active:ring-2 data-active:ring-face-accent/60",
                )}
                style={{ transform: FACE_TRANSFORMS[SERVICE_FACES[i]] }}
              >
                <div className="gb-face-grid absolute inset-0" />
                <div className="relative flex items-center justify-between font-display text-[length:calc(var(--cube)*0.055)] font-semibold tracking-[0.18em] text-face-ink-2 tabular-nums">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>/ {String(services.length).padStart(2, "0")}</span>
                </div>
                <Icon
                  name={service.icon}
                  strokeWidth={1.5}
                  className="relative mt-auto mb-[calc(var(--cube)*0.07)] text-[length:calc(var(--cube)*0.17)] text-face-accent"
                />
                <p className="relative font-display text-[length:calc(var(--cube)*0.088)] leading-tight font-bold text-balance">
                  {service.name}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
