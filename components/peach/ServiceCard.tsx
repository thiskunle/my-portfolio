"use client";

import { cardTones, type CardTone } from "@/components/peach/cardTones";
import { ServiceArt } from "@/components/peach/ServiceArt";
import { useTilt } from "@/components/peach/useTilt";
import type { ServiceCardData } from "@/lib/content";
import { cn } from "@/lib/cn";

type ServiceCardProps = {
  service: ServiceCardData;
  index: number;
  tone: CardTone;
};

/** One service: illustration, number, name and a one-line summary. Tilts toward the pointer. */
export function ServiceCard({ service, index, tone }: ServiceCardProps) {
  const tilt = useTilt<HTMLDivElement>();
  const t = cardTones[tone];

  return (
    <div
      ref={tilt}
      className={cn(
        "flex h-full min-h-64 flex-col rounded-card p-7 shadow-lift will-change-transform",
        t.surface,
        t.ink,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <ServiceArt id={service.id} />
        <span className={cn("font-display text-sm font-semibold", t.muted)}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-auto pt-8 font-display text-2xl font-extrabold tracking-tight">{service.name}</h3>
      <p className={cn("mt-2", t.muted)}>{service.summary}</p>
    </div>
  );
}
