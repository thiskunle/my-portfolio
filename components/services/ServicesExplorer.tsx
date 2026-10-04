"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/components/hooks/useMediaQuery";
import { ServiceCube } from "@/components/services/ServiceCube";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/lib/content";

const DESKTOP_QUERY = "(min-width: 64rem)"; // Tailwind lg
const pad = (n: number) => String(n).padStart(2, "0");

type ServicesExplorerProps = {
  services: readonly Service[];
  /** Server-rendered section heading, placed above the list on desktop and above the cube on mobile. */
  heading: ReactNode;
};

/**
 * Links the service list and the cube through one active index.
 *
 * Desktop (lg+, motion allowed): the cube column is sticky while the list scrolls past it; the
 * service crossing the middle of the viewport becomes active. Selecting a service scrolls it to
 * that middle band, with scroll-sync paused until the scroll settles.
 *
 * Mobile/tablet and reduced motion: no scroll-sync and no sticky stage. Services are selected
 * by tapping the list or the previous/next controls under the cube.
 */
export function ServicesExplorer({ services, heading }: ServicesExplorerProps) {
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reduceMotion = useReducedMotion();
  const scrollSync = isDesktop && !reduceMotion;

  const items = useRef<(HTMLLIElement | null)[]>([]);
  const syncPaused = useRef(false);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!scrollSync) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (syncPaused.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, [scrollSync]);

  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  function select(index: number) {
    setActive(index);
    if (!scrollSync) return;

    const item = items.current[index];
    if (!item) return;

    // Hold the selection while the page scrolls, so passing services don't override it.
    syncPaused.current = true;
    clearTimeout(releaseTimer.current);
    const release = () => {
      syncPaused.current = false;
      clearTimeout(releaseTimer.current);
      window.removeEventListener("scrollend", release);
    };
    window.addEventListener("scrollend", release, { once: true });
    releaseTimer.current = setTimeout(release, 1200); // fallback where scrollend is unsupported
    item.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  const step = (delta: number) => select((active + delta + services.length) % services.length);

  return (
    <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">{heading}</div>

      {/* Cube stage: sticky beside the list on desktop, in flow on smaller screens. */}
      <div className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <div className="lg:sticky lg:top-header lg:flex lg:h-[calc(100svh-var(--header-h))] lg:flex-col lg:justify-center motion-reduce:lg:static motion-reduce:lg:h-auto">
          <ServiceCube services={services} activeIndex={active} />

          <div className="mx-auto mt-6 flex w-full max-w-sm items-center justify-between gap-4">
            <Button variant="icon" aria-label="Previous service" onClick={() => step(-1)}>
              <Icon name="chevron-left" />
            </Button>
            <p className="text-center text-sm text-ink-2">
              <span className="font-display font-semibold text-forest tabular-nums">
                {pad(active + 1)} / {pad(services.length)}
              </span>
              <span className="mt-0.5 block font-medium text-ink">{services[active].name}</span>
            </p>
            <Button variant="icon" aria-label="Next service" onClick={() => step(1)}>
              <Icon name="chevron-right" />
            </Button>
          </div>
        </div>
      </div>

      <ol className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <li
              key={service.id}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-index={i}
              data-active={isActive || undefined}
              className="group/item relative grid grid-cols-[2.75rem_1fr] border-t border-line py-7 last:border-b sm:grid-cols-[3.5rem_1fr] lg:min-h-[30svh] lg:content-center lg:py-10"
            >
              {/* Active rule draws across the top border. */}
              <span
                aria-hidden
                className="absolute -top-px left-0 h-0.5 w-full origin-left scale-x-0 bg-forest transition-transform duration-500 ease-out-expo group-data-active/item:scale-x-100 motion-reduce:transition-none"
              />
              <span
                aria-hidden
                className="pt-1.5 font-display text-sm font-semibold text-ink-2 tabular-nums transition-colors group-data-active/item:text-forest sm:pt-2.5"
              >
                {pad(i + 1)}
              </span>
              <div>
                <h3 className="text-h3">
                  <button
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => select(i)}
                    className="-mx-2 flex min-h-11 items-center gap-3 rounded-md px-2 text-left text-ink-2 transition-colors duration-200 hover:text-ink aria-[current]:text-ink"
                  >
                    <Icon name={service.icon} className="text-[0.8em] text-forest" />
                    {service.name}
                  </button>
                </h3>
                <p className="mt-2 max-w-[52ch] text-ink-2">{service.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
