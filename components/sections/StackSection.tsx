"use client";

import { useRef } from "react";
import type { CardTone } from "@/components/peach/cardTones";
import { cardTones } from "@/components/peach/cardTones";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { stackSection } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Draggable, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type TagSize = (typeof stackSection.tags)[number]["size"];

const sizeClasses: Record<TagSize, string> = {
  lg: "px-5 py-3 text-lg sm:px-8 sm:py-4 sm:text-3xl",
  md: "px-5 py-3 text-lg sm:px-6 sm:text-xl",
  sm: "px-4 py-2.5 text-sm sm:px-5 sm:text-base",
};

const sizeTones: Record<TagSize, readonly CardTone[]> = {
  lg: ["red", "face"],
  md: ["face", "blush"],
  sm: ["snow", "blush"],
};

/** Inset from the playground edge, in px. */
const PAD = 16;

/** Small deterministic wobble, so the reset layout is identical on every visit. */
const wobble = (k: number, spread: number) => (((k * 37) % 11) / 10 - 0.5) * spread;

/**
 * Technology stack as a playground of tags: drag and throw them (they glide with momentum and
 * bounce off the edges), Shuffle them, or Reset to the tidy layout. Tag size reflects
 * importance. Without JS the tags simply wrap inside the playground.
 */
export function StackSection() {
  const root = useRef<HTMLElement | null>(null);
  const board = useRef<HTMLUListElement | null>(null);
  const actions = useRef({ shuffle: () => {}, reset: () => {} });

  useGSAP(
    () => {
      const el = board.current!;
      const reduce = prefersReducedMotion();
      const tags = gsap.utils.toArray<HTMLElement>("[data-tag]", el);
      // Spread big and small tags across the grid instead of filling rows by size.
      const spread = tags.map((_, i) => (i * 5) % tags.length);

      const layout = (mode: "reset" | "shuffle") => {
        const W = el.clientWidth;
        const H = el.clientHeight;
        const cols = W < 640 ? 2 : W < 1000 ? 3 : 4;
        const rows = Math.ceil(tags.length / cols);
        const cellW = (W - PAD * 2) / cols;
        const cellH = (H - PAD * 2) / rows;
        const slots = mode === "shuffle" ? gsap.utils.shuffle([...spread]) : spread;
        const animate = !reduce && el.dataset.ready === "true";

        tags.forEach((tag, k) => {
          const slot = slots[k];
          const col = slot % cols;
          const row = Math.floor(slot / cols);
          const jitter = mode === "shuffle" ? () => gsap.utils.random(-0.3, 0.3) : (n: number) => wobble(k + n, 0.4);
          const cx = PAD + (col + 0.5 + jitter(1)) * cellW;
          const cy = PAD + (row + 0.5 + jitter(3)) * cellH;
          gsap.to(tag, {
            x: gsap.utils.clamp(PAD, W - tag.offsetWidth - PAD, cx - tag.offsetWidth / 2),
            y: gsap.utils.clamp(PAD, H - tag.offsetHeight - PAD, cy - tag.offsetHeight / 2),
            rotate: mode === "shuffle" ? gsap.utils.random(-16, 16) : wobble(k + 5, 18),
            duration: animate ? 1 : 0,
            ease: "elastic.out(1, 0.65)",
            delay: animate ? k * 0.015 : 0,
          });
        });
        el.dataset.ready = "true";
      };

      layout("reset");
      actions.current = { shuffle: () => layout("shuffle"), reset: () => layout("reset") };

      const draggables = Draggable.create(tags, {
        type: "x,y",
        bounds: el,
        inertia: !reduce,
        edgeResistance: 0.7,
        zIndexBoost: true,
        onPress(this: Draggable) {
          gsap.to(this.target, { scale: 1.12, rotate: 0, duration: 0.2 });
        },
        onRelease(this: Draggable) {
          gsap.to(this.target, {
            scale: 1,
            rotate: gsap.utils.random(-14, 14),
            duration: reduce ? 0 : 0.8,
            ease: "elastic.out(1, 0.5)",
          });
        },
      });

      let lastWidth = el.clientWidth;
      const observer = new ResizeObserver(() => {
        if (el.clientWidth === lastWidth) return;
        lastWidth = el.clientWidth;
        layout("reset");
      });
      observer.observe(el);

      if (!reduce && root.current) {
        drawScribbles(root.current);
        gsap.from(tags, {
          scale: 0,
          stagger: { each: 0.035, from: "random" },
          duration: 0.7,
          ease: "back.out(2.6)",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      }

      return () => {
        observer.disconnect();
        draggables.forEach((d) => d.kill());
      };
    },
    { scope: root },
  );

  const controlButton =
    "min-h-12 rounded-full px-6 font-semibold transition-colors duration-200 motion-reduce:transition-none";

  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="gb-section gb-section-cream relative py-section">
      <CurvedEdge flip />
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <ShowcaseHeading
            id="stack-title"
            eyebrow={stackSection.eyebrow}
            title={stackSection.title}
            accent={stackSection.accent}
            note={stackSection.note}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => actions.current.shuffle()}
              className={cn(controlButton, "bg-forest text-on-forest hover:bg-forest-hover")}
            >
              {stackSection.shuffleLabel} ✦
            </button>
            <button
              type="button"
              onClick={() => actions.current.reset()}
              className={cn(controlButton, "text-ink ring-2 ring-ink/30 ring-inset hover:ring-ink")}
            >
              {stackSection.resetLabel}
            </button>
          </div>
        </div>

        <ul
          ref={board}
          aria-label="Technologies"
          className="group/board relative mt-10 flex h-[34rem] flex-wrap content-center justify-center gap-3 overflow-clip rounded-[2rem] bg-card p-4 shadow-[inset_0_0_0_1px_var(--gb-line)] [background-image:radial-gradient(var(--gb-line)_1.5px,transparent_1.5px)] [background-size:22px_22px] max-sm:h-[38rem] sm:mt-14 sm:h-[32rem] lg:h-[34rem]"
        >
          {stackSection.tags.map((tag, i) => {
            const t = cardTones[sizeTones[tag.size][i % 2]];
            return (
              <li
                key={tag.label}
                data-tag
                className={cn(
                  "cursor-grab rounded-full font-display font-bold whitespace-nowrap shadow-lift select-none active:cursor-grabbing group-data-[ready=true]/board:absolute group-data-[ready=true]/board:top-0 group-data-[ready=true]/board:left-0",
                  sizeClasses[tag.size],
                  t.surface,
                  t.ink,
                  tag.size === "sm" && "ring-1 ring-wine/15",
                )}
              >
                {tag.label}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
