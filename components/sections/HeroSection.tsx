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
  "inline-flex items-center justify-center gap-2.5 rounded-full leading-none font-semibold whitespace-nowrap " +
  "transition-[background-color,color,translate] duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-forest-hover hover:text-white " +
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
      </div>

      <Container className="relative pb-16 lg:pt-header lg:pb-0">
        <div className="lg:max-w-[min(50rem,60%)]">
          <p
            data-hero-fade
            className="mb-6 flex flex-wrap items-center gap-x-3 font-display text-sm font-bold tracking-[0.22em] text-ink-2 uppercase"
          >
            {peachHero.markets.map((market, i) => (
              <span key={market} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden className="size-1.5 rounded-full bg-accent" /> : null}
                {market}
              </span>
            ))}
          </p>
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

          <p data-hero-fade className="mt-7 max-w-[44ch] text-lead text-ink-2">
            {peachHero.description}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={peachHero.primaryCta.href}
              className={`${ctaBase} w-full min-h-16 bg-forest px-9 text-lg text-on-forest shadow-[0_22px_48px_-16px_rgb(40_0_8/0.7)] sm:w-auto`}
            >
              {peachHero.primaryCta.label}
              <Icon name="arrow-right" />
            </a>
            {/* Secondary action as a quieter text link, so Start a Project leads. */}
            <a
              href={peachHero.secondaryCta.href}
              className="group inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-white/40 decoration-2 underline-offset-8 transition-colors hover:decoration-white"
            >
              {peachHero.secondaryCta.label}
              <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </a>
          </div>
        </div>
      </Container>

      <HeroCursor />
    </section>
  );
}
