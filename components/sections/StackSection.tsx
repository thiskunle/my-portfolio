"use client";

import { useRef } from "react";
import { cardTones, type CardTone } from "@/components/peach/cardTones";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { stackSection } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Draggable, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const tones: readonly CardTone[] = ["snow", "face", "blush", "snow", "blush", "face"];

/** Below this board width the tags wrap in normal flow instead of being scattered. */
const SCATTER_MIN = 640;

/** Small deterministic wobble, so the first layout is identical on every visit. */
const wobble = (k: number, spread: number) => (((k * 37) % 11) / 10 - 0.5) * spread;

/**
 * Technology stack as a board of tags you can drag around, plus a Shuffle button. Wide boards
 * scatter the tags over a loose grid; narrow ones keep them in a wrapped row (still
 * draggable). Without JS the tags simply wrap.
 */
export function StackSection() {
  const root = useRef<HTMLElement | null>(null);
  const board = useRef<HTMLUListElement | null>(null);
  const shuffleRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const el = board.current!;
      const reduce = prefersReducedMotion();
      const tags = gsap.utils.toArray<HTMLElement>("[data-tag]", el);

      const layout = (shuffle: boolean) => {
        const scatter = el.clientWidth >= SCATTER_MIN;
        el.dataset.layout = scatter ? "scatter" : "flow";
        const duration = shuffle && !reduce ? 1 : 0;
        const ease = "elastic.out(1, 0.6)";

        if (!scatter) {
          el.style.height = "";
          if (shuffle) gsap.utils.shuffle([...tags]).forEach((t) => el.appendChild(t));
          tags.forEach((tag, k) =>
            gsap.to(tag, { x: 0, y: 0, left: "auto", top: "auto", xPercent: 0, yPercent: 0, rotate: shuffle ? gsap.utils.random(-8, 8) : wobble(k, 12), duration, ease }),
          );
          return;
        }

        const cols = el.clientWidth < 1000 ? 4 : 5;
        const rowH = el.clientWidth < 1000 ? 84 : 100;
        el.style.height = `${Math.ceil(tags.length / cols) * rowH + 48}px`;
        const order = shuffle ? gsap.utils.shuffle(tags.map((_, i) => i)) : tags.map((_, i) => i);
        tags.forEach((tag, k) => {
          const slot = order[k];
          const col = slot % cols;
          const row = Math.floor(slot / cols);
          // Centre a short last row.
          const inRow = Math.min(cols, tags.length - row * cols);
          const shift = (cols - inRow) / 2;
          gsap.to(tag, {
            left: `${6 + ((col + 0.5 + shift) / cols) * 88 + (shuffle ? gsap.utils.random(-2, 2) : wobble(k, 3))}%`,
            top: 24 + (row + 0.5) * rowH + (shuffle ? gsap.utils.random(-14, 14) : wobble(k + 3, 24)),
            x: 0,
            y: 0,
            xPercent: -50,
            yPercent: -50,
            rotate: shuffle ? gsap.utils.random(-14, 14) : wobble(k + 5, 20),
            duration,
            ease,
            delay: duration ? k * 0.015 : 0,
          });
        });
      };

      layout(false);
      shuffleRef.current = () => layout(true);

      const draggables = Draggable.create(tags, {
        bounds: el,
        zIndexBoost: true,
        onPress(this: Draggable) {
          gsap.to(this.target, { scale: 1.12, rotate: 0, duration: 0.2 });
        },
        onRelease(this: Draggable) {
          gsap.to(this.target, { scale: 1, rotate: gsap.utils.random(-12, 12), duration: reduce ? 0 : 0.6, ease: "elastic.out(1, 0.5)" });
        },
      });

      let lastWidth = el.clientWidth;
      const observer = new ResizeObserver(() => {
        if (el.clientWidth === lastWidth) return;
        lastWidth = el.clientWidth;
        layout(false);
      });
      observer.observe(el);

      if (!reduce && root.current) {
        drawScribbles(root.current);
        gsap.from(tags, {
          scale: 0,
          stagger: { each: 0.03, from: "random" },
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

  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="relative overflow-clip py-section text-ink">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <ShowcaseHeading
            id="stack-title"
            eyebrow={stackSection.eyebrow}
            title={stackSection.title}
            accent={stackSection.accent}
            note={stackSection.note}
          />
          <button
            type="button"
            onClick={() => shuffleRef.current()}
            className="min-h-13 rounded-full border-2 border-white/60 px-7 font-semibold text-ink transition-colors duration-200 hover:border-transparent hover:bg-forest hover:text-on-forest"
          >
            {stackSection.shuffleLabel} ✦
          </button>
        </div>

        <ul
          ref={board}
          aria-label="Technologies"
          className="group/board relative mt-12 flex flex-wrap justify-center gap-3 sm:mt-16 data-[layout=scatter]:block"
        >
          {stackSection.tags.map((tag, i) => {
            const t = cardTones[tones[i % tones.length]];
            return (
              <li
                key={tag}
                data-tag
                className={cn(
                  "cursor-grab rounded-full px-6 py-3 font-display text-lg font-bold whitespace-nowrap shadow-lift select-none active:cursor-grabbing sm:px-7 sm:py-4 sm:text-2xl group-data-[layout=scatter]/board:absolute",
                  t.surface,
                  t.ink,
                )}
              >
                {tag}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
