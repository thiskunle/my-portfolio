"use client";

import { useRef } from "react";
import { CursorTrackingCanvas } from "@/components/hero/CursorTrackingCanvas";
import { HeroCursor } from "@/components/hero/HeroCursor";
import { Scribble } from "@/components/peach/Scribble";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { peachHero } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const ctaBase =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full px-7 text-base leading-none font-semibold whitespace-nowrap " +
  "transition-[background-color,color,border-color,translate] duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-transparent hover:bg-forest-hover hover:text-white " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/** Renders the last headline line with its accent ending underlined. */
function AccentLine({ line, accent }: { line: string; accent: string }) {
  if (!line.endsWith(accent)) return line;
  return (
    <>
      {line.slice(0, -accent.length)}
      <Scribble tone="inherit">{accent}</Scribble>
    </>
  );
}

/**
 * Homepage hero: the cursor-tracking character beside an oversized headline that rises in line
 * by line. Start states are set in CSS ([data-hero-line], [data-hero-fade] in app/globals.css)
 * so nothing flashes before hydration; reduced motion and no-JS visitors see the final layout.
 */
export function HeroSection() {
  const root = useRef<HTMLElement | null>(null);
  const lines = peachHero.headline;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ delay: 0.15 })
        // y: 0 discards the CSS start offset, which GSAP would otherwise read as pixels.
        .fromTo("[data-hero-line]", { y: 0, yPercent: 110 }, { yPercent: 0, stagger: 0.12, duration: 1.1 })
        .fromTo(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.9 },
          0.45,
        )
        .to(".gb-scribble path", { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.8);

      // Leaving the hero: the character drifts up a little faster than the page.
      gsap.to("[data-hero-visual]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="home"
      aria-labelledby="hero-title"
      // bg-paper matches HERO_BACKDROP in CursorTrackingCanvas. HeroCursor sets
      // data-custom-cursor when it takes over from the native cursor.
      className="relative isolate overflow-clip bg-paper text-ink data-custom-cursor:cursor-none data-custom-cursor:[&_*]:cursor-none lg:flex lg:min-h-svh lg:items-center"
    >
      <div data-hero-visual className="relative -z-10 h-[58svh] lg:absolute lg:inset-0 lg:h-auto">
        <CursorTrackingCanvas />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-paper to-transparent lg:hidden"
        />
        <p
          data-hero-fade
          className="absolute top-[24%] left-[76%] hidden max-w-[13rem] font-display text-sm font-semibold text-ink-2 lg:block"
        >
          <span className="hidden pointer-fine:inline">{peachHero.pointerNote.mouse}</span>
          <span className="pointer-fine:hidden">{peachHero.pointerNote.touch}</span>
          <svg
            aria-hidden
            focusable="false"
            viewBox="0 0 80 60"
            className="mt-2 h-10 w-14 -scale-x-100 text-ink-2"
          >
            <path
              d="M70 6 C 52 10, 30 22, 18 46 M18 46 L 14 32 M18 46 L 31 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
      </div>

      <Container className="relative pb-16 lg:pt-header lg:pb-0">
        <div className="lg:max-w-[min(44rem,54%)]">
          <h1
            id="hero-title"
            className="font-display text-hero font-extrabold uppercase [text-shadow:0_2px_24px_rgb(0_0_0/0.18)]"
          >
            {lines.map((line, i) => (
              // Each line is masked so it can rise out of its own baseline.
              <span key={line} className="-mb-[0.08em] block overflow-clip pb-[0.08em]">
                <span data-hero-line className="block">
                  {i === lines.length - 1 ? <AccentLine line={line} accent={peachHero.accent} /> : line}
                </span>
              </span>
            ))}
          </h1>

          <p data-hero-fade className="mt-7 max-w-[40ch] text-lead text-ink-2">
            {peachHero.description}
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap gap-3">
            <a
              href={peachHero.primaryCta.href}
              className={`${ctaBase} w-full border border-transparent bg-forest text-on-forest shadow-[0_18px_40px_-14px_rgb(40_0_8/0.55)] sm:w-auto`}
            >
              {peachHero.primaryCta.label}
              <Icon name="arrow-right" />
            </a>
            <a
              href={peachHero.secondaryCta.href}
              className={`${ctaBase} w-full border-2 border-white/60 bg-transparent text-ink sm:w-auto`}
            >
              {peachHero.secondaryCta.label}
            </a>
          </div>
        </div>
      </Container>

      <HeroCursor />
    </section>
  );
}
