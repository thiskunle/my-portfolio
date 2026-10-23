"use client";

import { useRef, useState, type ReactNode } from "react";
import { useMinuteClock } from "@/components/peach/useMinuteClock";
import type { Location } from "@/lib/content";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Resting place of a card by its depth (0 = selected, in front). Back cards fan out to the sides. */
const fan = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 18, y: 4, rotate: 7, scale: 0.92 },
  { x: -18, y: 8, rotate: -7, scale: 0.88 },
];

function formatTime(time: number, timeZone: string, withDay = false) {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    weekday: withDay ? "short" : undefined,
    timeZone,
  }).format(time);
}

/** Depth order with `id` in front; the others keep their relative order behind it. */
function orderWith(ids: string[], id: string) {
  return [id, ...ids.filter((other) => other !== id)];
}

/** Concentric "signal" rings marking the market on each card. */
function MarketMark() {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 120 120" className="size-28 text-face-accent sm:size-32">
      {[56, 42, 28].map((r, i) => (
        <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.25 + i * 0.2} />
      ))}
      <circle cx="60" cy="60" r="9" fill="currentColor" />
    </svg>
  );
}

type LocationExplorerProps = {
  locations: readonly Location[];
  localTimeLabel: string;
  pickerLabel: string;
  /** Section heading and intro, rendered above the market picker. */
  heading: ReactNode;
};

/**
 * Markets as a fanned stack of large cards beside a picker. Choosing a market (picker button or
 * a card in the stack) brings its card forward and swaps the supporting text and local time.
 */
export function LocationExplorer({ locations, localTimeLabel, pickerLabel, heading }: LocationExplorerProps) {
  const [order, setOrder] = useState(() => locations.map((l) => l.id));
  const cards = useRef(new Map<string, HTMLDivElement>());
  const now = useMinuteClock();
  const selected = locations.find((l) => l.id === order[0]) ?? locations[0];

  function select(id: string) {
    if (id === order[0]) return;
    setOrder((current) => orderWith(current, id));
    const card = cards.current.get(id);
    if (card && !prefersReducedMotion()) {
      // A small lift as the card comes forward; the fan positions themselves ease via CSS.
      gsap.fromTo(card, { y: -36, rotate: -3 }, { y: 0, rotate: 0, duration: 0.7, ease: "back.out(1.7)" });
    }
  }

  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-20">
      <div data-about-copy>
        {heading}

        <p className="mt-10 font-display text-sm font-bold tracking-[0.2em] text-ink-2 uppercase">{pickerLabel}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3" role="group" aria-label={pickerLabel}>
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              aria-pressed={order[0] === location.id}
              onClick={() => select(location.id)}
              className="group flex min-h-16 flex-col items-start justify-center rounded-card px-5 py-3 text-left ring-1 ring-ink/25 transition-colors duration-200 ring-inset hover:bg-ink/8 aria-pressed:bg-snow aria-pressed:text-wine aria-pressed:ring-transparent"
            >
              <span className="font-display text-lg font-bold">{location.name}</span>
              {location.region ? (
                <span className="text-sm text-ink-2 group-aria-pressed:text-wine/70">{location.region}</span>
              ) : null}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="mt-8 min-h-28 border-l-2 border-accent pl-5">
          <p className="text-lead text-ink-2">{selected.description}</p>
          <p className="mt-3 text-sm text-ink-2">
            {localTimeLabel} in {selected.name}:{" "}
            <span className="font-display text-base font-bold text-ink tabular-nums">
              {now === null ? "--:--" : formatTime(now, selected.timeZone, true)}
            </span>
          </p>
        </div>
      </div>

      <div data-about-stack className="relative mx-auto mb-10 aspect-[5/6] w-[min(28rem,78%)] sm:w-[min(30rem,70%)] lg:mb-0 lg:w-[min(30rem,78%)]">
        <ul className="contents">
          {locations.map((location, i) => {
            const depth = order.indexOf(location.id);
            const rest = fan[Math.min(depth, fan.length - 1)];
            return (
              <li
                key={location.id}
                className="absolute inset-0 transition-transform duration-700 ease-out-expo motion-reduce:transition-none"
                style={{
                  zIndex: locations.length - depth,
                  transform: `translate(${rest.x}%, ${rest.y}%) rotate(${rest.rotate}deg) scale(${rest.scale})`,
                }}
              >
                <div
                  ref={(el) => {
                    if (el) cards.current.set(location.id, el);
                    else cards.current.delete(location.id);
                  }}
                  className={cn(
                    "gb-grid-face @container relative flex h-full flex-col justify-between overflow-clip rounded-[2rem] bg-face p-7 text-face-ink shadow-lift ring-1 ring-face-line transition-[filter] duration-500 sm:p-9",
                    depth !== 0 && "brightness-75",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-sm font-semibold text-face-ink-2">
                      {String(i + 1).padStart(2, "0")} / {String(locations.length).padStart(2, "0")}
                    </span>
                    <MarketMark />
                  </div>

                  <div>
                    {/* Sized to the card so the longest name (MANCHESTER) still fits. */}
                    <p className="font-display text-[14cqi] leading-none font-extrabold tracking-tight uppercase">
                      {location.name}
                    </p>
                    {location.region ? <p className="mt-3 text-lead text-face-ink-2">{location.region}</p> : null}
                  </div>

                  <p className="flex items-baseline justify-between border-t border-face-line pt-5 text-sm text-face-ink-2">
                    {localTimeLabel}
                    <span className="font-display text-2xl font-semibold text-face-ink tabular-nums">
                      {now === null ? "--:--" : formatTime(now, location.timeZone)}
                    </span>
                  </p>

                  {/* Back cards are selectable straight from the stack. */}
                  {depth !== 0 ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      onClick={() => select(location.id)}
                      className="absolute inset-0 cursor-pointer"
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
