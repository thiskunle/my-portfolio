"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { openProjectDialog, projectDialogId } from "@/components/projects/projectDialogs";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";

const DRAG_THRESHOLD = 6; // px before a press becomes a drag
const DRAG_SENSITIVITY = 0.3; // degrees per px
const pad = (n: number) => String(n).padStart(2, "0");

type RingCardProps = {
  project: Project;
  index: number;
  step: number;
  angle: MotionValue<number>;
  isFront: boolean;
  onActivate: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
};

function RingCard({ project, index, step, angle, isFront, onActivate, onKeyDown, buttonRef }: RingCardProps) {
  // How directly the card faces the viewer: 1 front, 0 side-on, negative turned away.
  const facing = useTransform(angle, (a) => Math.cos(((index * step + a) * Math.PI) / 180));
  const opacity = useTransform(facing, (f) => 0.28 + 0.72 * Math.max(0, f));
  // Cards turned away can't be clicked through the ones in front.
  const pointerEvents = useTransform(facing, (f) => (f > 0.3 ? "auto" : "none"));

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      tabIndex={isFront ? 0 : -1}
      aria-haspopup={isFront ? "dialog" : undefined}
      aria-controls={isFront ? projectDialogId(project.id) : undefined}
      onClick={() => onActivate(index)}
      onKeyDown={onKeyDown}
      className="absolute top-0 left-[calc(var(--w)/-2)] w-[var(--w)] overflow-hidden rounded-card bg-card text-left shadow-lift ring-1 ring-line ring-inset backface-hidden"
      style={{ transform: `rotateY(${index * step}deg) translateZ(var(--r))`, opacity, pointerEvents }}
    >
      <span className="relative block aspect-[4/3]">
        <ProjectVisual project={project} sizes="20rem" />
      </span>
      <span className="block p-5">
        <span className="flex items-center gap-2 text-sm font-semibold text-forest">
          <Icon name={project.icon} />
          {project.category}
        </span>
        <span className="mt-2 block font-display text-xl leading-snug font-bold text-ink">
          {project.title}
        </span>
        <span className="sr-only">{isFront ? ". View details" : ". Bring to front"}</span>
      </span>
    </motion.button>
  );
}

/**
 * Desktop 3D project ring (lg+). Drag, previous/next, arrow keys, or click a side card to turn;
 * click the front card (or "View details") to open its dialog.
 *
 * Only the front card is in the tab order (roving tabindex); arrow keys turn the ring and move
 * focus with it. Reduced motion: turns snap instead of animating.
 */
export function ProjectRing({ projects }: { projects: readonly Project[] }) {
  const count = projects.length;
  const step = 360 / count;
  const reduceMotion = useReducedMotion();

  const angle = useMotionValue(0);
  const ringTransform = useTransform(angle, (a) => `translateZ(calc(var(--r) * -1)) rotateY(${a}deg)`);
  const frontFor = (a: number) => (((Math.round(-a / step) % count) + count) % count);
  const [front, setFront] = useState(0);
  useMotionValueEvent(angle, "change", (a) => setFront(frontFor(a)));

  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; start: number; pointerId: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);

  function turnTo(index: number, moveFocus = false) {
    const current = angle.get();
    const goal = -index * step;
    const delta = ((((goal - current) % 360) + 540) % 360) - 180; // shortest way round
    if (reduceMotion) angle.set(current + delta);
    else animate(angle, current + delta, { duration: 0.7, ease: easeOutExpo });
    if (moveFocus) cards.current[((index % count) + count) % count]?.focus({ preventScroll: true });
  }

  function activate(index: number) {
    if (suppressClick.current) return;
    if (index === front) openProjectDialog(projects[index].id);
    else turnTo(index);
  }

  function onCardKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, number> = { ArrowLeft: front - 1, ArrowRight: front + 1, Home: 0, End: count - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    turnTo(keys[event.key], true);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    angle.stop();
    drag.current = { x: event.clientX, start: angle.get(), pointerId: event.pointerId, moved: false };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || event.pointerId !== state.pointerId) return;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (state.moved) angle.set(state.start + dx * DRAG_SENSITIVITY);
  }

  function onPointerEnd() {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    setDragging(false);
    // The click that follows this pointerup must not open or turn anything.
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    turnTo(frontFor(angle.get()));
  }

  const current = projects[front];

  return (
    <div>
      <div
        className={cn(
          "relative h-[27rem] touch-pan-y select-none perspective-[1600px] [--r:21rem] [--w:18rem] xl:[--r:22.5rem] xl:[--w:19rem]",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <motion.div
          className="absolute top-2 left-1/2 h-full w-0 transform-3d"
          style={{ transform: ringTransform }}
        >
          {projects.map((project, i) => (
            <RingCard
              key={project.id}
              project={project}
              index={i}
              step={step}
              angle={angle}
              isFront={i === front}
              onActivate={activate}
              onKeyDown={onCardKeyDown}
              buttonRef={(el) => {
                cards.current[i] = el;
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-8 flex max-w-xl items-center justify-between gap-6">
        <Button variant="icon" size="lg" aria-label="Previous project" onClick={() => turnTo(front - 1)}>
          <Icon name="chevron-left" />
        </Button>
        <div className="flex flex-col items-center gap-3 text-center">
          <p aria-live="polite" className="text-sm text-ink-2">
            <span className="font-display font-semibold text-forest tabular-nums">
              {pad(front + 1)} / {pad(count)}
            </span>
            <span className="sr-only">: {current.title}</span>
          </p>
          <Button
            variant="secondary"
            aria-haspopup="dialog"
            aria-controls={projectDialogId(current.id)}
            onClick={() => openProjectDialog(current.id)}
          >
            View details
            <span className="sr-only">: {current.title}</span>
          </Button>
        </div>
        <Button variant="icon" size="lg" aria-label="Next project" onClick={() => turnTo(front + 1)}>
          <Icon name="chevron-right" />
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-ink-2">
        Drag the ring, use the arrows, or select the front project for details.
      </p>
    </div>
  );
}
