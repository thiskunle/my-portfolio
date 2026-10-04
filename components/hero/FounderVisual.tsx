import Image from "next/image";
import { PortraitTilt } from "@/components/hero/PortraitTilt";
import { Icon } from "@/components/ui/Icon";
import { company, hero, services, type Service } from "@/lib/content";
import { cn } from "@/lib/cn";

const featured = hero.featuredServiceIds
  .map((id) => services.find((service) => service.id === id))
  .filter((service): service is Service => service !== undefined);

/* Placement and depth (translateZ) for each floating chip, md and up. */
const chipLayout = [
  { position: "top-[10%] -left-10", depth: "md:[translate:0_0_3.5rem]" },
  { position: "top-[46%] -right-8", depth: "md:[translate:0_0_5rem]" },
  { position: "bottom-[22%] -left-6", depth: "md:[translate:0_0_2.5rem]" },
];

const chipStyle =
  "flex items-center gap-2 rounded-2xl bg-card px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap text-ink shadow-lift ring-1 ring-line ring-inset";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

/**
 * Founder portrait with the brand plate, caption and service chips.
 * Shows the approved "AA" monogram until hero.portrait is set in lib/content.ts;
 * the real photo then drops into the same 4:5 frame with no layout change.
 */
export function FounderVisual() {
  const portrait = hero.portrait;

  return (
    <div className="mx-auto w-full max-w-[17rem] sm:max-w-xs md:max-w-sm lg:max-w-[25rem]">
      <div className="perspective-[1100px]">
        <PortraitTilt className="relative">
          {/* Brand plate behind the frame */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-panel bg-linear-160 from-forest-2 via-forest via-60% to-forest-deep shadow-lift [translate:1rem_1rem_-3rem]"
          />

          <figure className="relative aspect-[4/5] overflow-hidden rounded-panel border border-line bg-card">
            {portrait ? (
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 1024px) 25rem, (min-width: 768px) 24rem, 17rem"
                fetchPriority="high"
                className="object-cover object-top"
              />
            ) : (
              <div aria-hidden className="absolute inset-0 grid place-items-center pb-14">
                <div className="gb-grid-paper absolute inset-0 [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_75%)]" />
                <span className="relative font-display text-8xl font-bold tracking-tighter text-forest lg:text-9xl">
                  {initials(company.founder.name)}
                </span>
              </div>
            )}

            <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-4 border-t border-line bg-card/90 px-5 py-4 backdrop-blur-sm">
              <span className="font-display font-semibold text-ink">{company.founder.name}</span>
              <span className="sr-only">, </span>
              <span className="text-sm font-medium text-forest">{company.founder.role}</span>
            </figcaption>
          </figure>

          {featured.map((service, i) => (
            <div
              key={service.id}
              aria-hidden
              className={cn(
                chipStyle,
                "absolute hidden motion-safe:animate-rise md:flex",
                chipLayout[i]?.position,
                chipLayout[i]?.depth,
              )}
              style={{ animationDelay: `${300 + i * 120}ms` }}
            >
              <Icon name={service.icon} className="text-lg text-forest" />
              {service.name}
            </div>
          ))}
        </PortraitTilt>
      </div>

      {/* Small screens: chips sit in a stable row under the portrait instead of floating over it. */}
      <ul aria-hidden className="mt-10 flex flex-wrap justify-center gap-2 md:hidden">
        {featured.map((service) => (
          <li key={service.id} className={chipStyle}>
            <Icon name={service.icon} className="text-lg text-forest" />
            {service.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
