"use client";

import { useRef, useState } from "react";
import { useMinuteClock } from "@/components/peach/useMinuteClock";
import { Icon } from "@/components/ui/Icon";
import type { Location } from "@/lib/content";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Resting offset of each card by its depth in the stack (0 = top). */
const fan = [
  { x: 0, y: 0, rotate: 0 },
  { x: 22, y: 14, rotate: 5 },
  { x: -18, y: 26, rotate: -6 },
];

function formatTime(time: number, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit", timeZone }).format(
    time,
  );
}

/** Moves `id` to the front while keeping the rest in their current cycle order. */
function bringToFront(order: string[], id: string) {
  const at = order.indexOf(id);
  return at <= 0 ? order : [...order.slice(at), ...order.slice(0, at)];
}

type LocationStackProps = {
  locations: readonly Location[];
  localTimeLabel: string;
  hint: string;
};

/**
 * A fanned stack of market cards. Clicking the top card tosses it to the back; the buttons
 * below jump straight to a market. Each card shows the market's live local time.
 */
export function LocationStack({ locations, localTimeLabel, hint }: LocationStackProps) {
  const [order, setOrder] = useState(() => locations.map((l) => l.id));
  const cards = useRef(new Map<string, HTMLDivElement>());
  const busy = useRef(false);
  const now = useMinuteClock();

  const nameOf = (id: string) => locations.find((l) => l.id === id)?.name ?? id;

  function show(id: string) {
    const topId = order[0];
    if (busy.current || id === topId) return;
    const top = cards.current.get(topId);
    if (!top || prefersReducedMotion()) {
      setOrder((o) => bringToFront(o, id));
      return;
    }
    busy.current = true;
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .to(top, { x: 280, y: -50, rotate: 16, duration: 0.35, ease: "power2.in" })
      .add(() => setOrder((o) => bringToFront(o, id)))
      .to(top, { x: 0, y: 0, rotate: 0, duration: 0.55, ease: "back.out(1.6)" });
  }

  return (
    <div>
      <div className="relative mx-auto aspect-[4/5] w-[min(24rem,82%)]">
        <ul className="contents">
          {locations.map((location, i) => {
            const depth = order.indexOf(location.id);
            const rest = fan[Math.min(depth, fan.length - 1)];
            return (
              <li
                key={location.id}
                className="absolute inset-0 transition-transform duration-500 ease-out-expo motion-reduce:transition-none"
                style={{
                  zIndex: locations.length - depth,
                  transform: `translate(${rest.x}px, ${rest.y}px) rotate(${rest.rotate}deg)`,
                }}
              >
                <div
                  ref={(el) => {
                    if (el) cards.current.set(location.id, el);
                    else cards.current.delete(location.id);
                  }}
                  className={cn(
                    "gb-grid-face @container flex h-full flex-col justify-between rounded-panel bg-face p-7 text-face-ink shadow-lift ring-1 ring-face-line",
                    depth !== 0 && "brightness-90",
                  )}
                >
                  <div className="flex items-start justify-between font-display text-sm font-semibold text-face-ink-2">
                    <span>
                      {String(i + 1).padStart(2, "0")} / {String(locations.length).padStart(2, "0")}
                    </span>
                    <Icon name="compass" className="text-2xl text-face-accent" />
                  </div>

                  <div>
                    {/* Sized to the card so the longest name (MANCHESTER) still fits. */}
                    <p className="font-display text-[13cqi] leading-none font-extrabold tracking-tight uppercase">
                      {location.name}
                    </p>
                    {location.region ? (
                      <p className="mt-3 text-lead text-face-ink-2">{location.region}</p>
                    ) : null}
                    {location.note ? <p className="mt-2 text-face-ink-2">{location.note}</p> : null}
                  </div>

                  <p className="flex items-baseline justify-between border-t border-face-line pt-4 text-sm text-face-ink-2">
                    {localTimeLabel}
                    <span className="font-display text-xl font-semibold text-face-ink tabular-nums">
                      {now === null ? "--:--" : formatTime(now, location.timeZone)}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Clicking anywhere on the stack advances it; screen readers use the buttons below. */}
        <button
          type="button"
          aria-label={`Show ${nameOf(order[1] ?? order[0])}`}
          onClick={() => show(order[1] ?? order[0])}
          className="absolute inset-0 z-10 cursor-pointer rounded-panel"
        />
      </div>

      <p className="mt-10 text-center text-sm text-ink-2">{hint}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Markets">
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            aria-pressed={order[0] === location.id}
            onClick={() => show(location.id)}
            className="min-h-11 rounded-full px-5 text-control font-semibold text-ink ring-1 ring-ink/40 transition-colors duration-200 ring-inset hover:bg-ink/10 aria-pressed:bg-forest aria-pressed:text-on-forest aria-pressed:ring-transparent"
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
}
