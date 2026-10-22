import { CursorTrackingCanvas } from "@/components/hero/CursorTrackingCanvas";
import { HeroCursor } from "@/components/hero/HeroCursor";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cursorHero } from "@/lib/content";

const ctaBase =
  "inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full px-7 text-base leading-none font-semibold whitespace-nowrap " +
  "transition-[background-color,color,border-color,translate] duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-transparent hover:bg-forest-hover hover:text-white " +
  "motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/**
 * Hero whose character follows the pointer (see CursorTrackingCanvas), with a glowing custom
 * cursor on mouse devices. On small screens the character sits above the copy; from lg up it
 * fills the hero behind it. Copy is server-rendered; the canvas and cursor are client islands.
 */
export function CursorTrackingHero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      // bg-paper is the same red as HERO_BACKDROP in CursorTrackingCanvas. HeroCursor sets
      // data-custom-cursor when it takes over from the native cursor.
      className="relative isolate overflow-clip bg-paper text-ink data-custom-cursor:cursor-none data-custom-cursor:[&_*]:cursor-none lg:flex lg:min-h-svh lg:items-end"
    >
      <div className="relative -z-10 h-[62svh] lg:absolute lg:inset-0 lg:h-auto">
        <CursorTrackingCanvas />
        {/* Small screens: fades the cropped photo into the copy below it. On wide screens the
            recoloured frames sit directly on the matching red, with no added glow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-linear-to-t from-paper to-transparent lg:hidden"
        />
      </div>

      <Container className="pb-14 lg:pt-header lg:pb-20">
        <div className="max-w-xl lg:max-w-[min(38rem,48%)]">
          <p className="mb-5 font-display text-eyebrow font-medium text-ink-2 uppercase">
            {cursorHero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="font-display text-h1 font-bold text-balance lg:text-[clamp(3rem,1.5rem+3vw,4.25rem)] [text-shadow:0_2px_24px_rgb(0_0_0/0.18)]"
          >
            {cursorHero.title}
          </h1>
          <p className="mt-6 max-w-[42ch] text-ink-2 lg:text-lead">{cursorHero.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={cursorHero.primaryCta.href}
              className={`${ctaBase} w-full border border-transparent bg-forest text-on-forest sm:w-auto`}
            >
              {cursorHero.primaryCta.label}
              <Icon name="arrow-right" />
            </a>
            <a
              href={cursorHero.secondaryCta.href}
              className={`${ctaBase} w-full border border-white/50 bg-transparent text-ink sm:w-auto`}
            >
              {cursorHero.secondaryCta.label}
            </a>
          </div>
        </div>
      </Container>

      <HeroCursor />
    </section>
  );
}
