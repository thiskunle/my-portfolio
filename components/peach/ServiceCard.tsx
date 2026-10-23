"use client";

import { cardTones, type CardTone } from "@/components/peach/cardTones";
import { useTilt } from "@/components/peach/useTilt";
import { Icon } from "@/components/ui/Icon";
import type { Service } from "@/lib/content";
import { cn } from "@/lib/cn";

type ServiceCardProps = {
  service: Service;
  index: number;
  tone: CardTone;
};

/** One service: number, icon, name and canonical description. Tilts toward the pointer. */
export function ServiceCard({ service, index, tone }: ServiceCardProps) {
  const tilt = useTilt<HTMLDivElement>();
  const t = cardTones[tone];

  return (
    <div
      ref={tilt}
      className={cn(
        "flex h-full min-h-72 flex-col rounded-card p-7 shadow-lift will-change-transform sm:p-8",
        t.surface,
        t.ink,
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("font-display text-sm font-semibold", t.muted)}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "grid size-12 place-items-center rounded-full border text-xl",
            t.line,
          )}
        >
          <Icon name={service.icon} />
        </span>
      </div>
      <h3 className="mt-auto pt-10 font-display text-h3 font-extrabold uppercase">{service.name}</h3>
      <p className={cn("mt-3", t.muted)}>{service.description}</p>
    </div>
  );
}
