"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { ServiceCardData } from "@/lib/content";

type ServiceCardProps = {
  service: ServiceCardData;
  index: number;
};

/**
 * One service: its rendered 3D artwork as the main visual (shown uncropped at its own aspect
 * ratio), then number, name and summary. Lifts slightly on hover with a glow tinted to the
 * artwork. Hover motion is CSS on this element, so it never fights the scroll animation on
 * the list item around it.
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <article
      style={{ "--glow": service.glow } as CSSProperties}
      className="group flex h-full flex-col overflow-clip rounded-card bg-card ring-1 ring-line shadow-[0_24px_48px_-28px_rgb(var(--glow)/0.55)] transition-[translate,scale,box-shadow] duration-500 ease-out-expo hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_40px_80px_-28px_rgb(var(--glow)/0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
    >
      <div className="overflow-clip bg-[#f6e6dc]">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          width={service.image.width}
          height={service.image.height}
          sizes="(min-width: 80rem) 26rem, (min-width: 48rem) 46vw, 92vw"
          className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-sm font-semibold text-accent">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">{service.name}</h3>
        </div>
        <p className="mt-2 text-ink-2">{service.summary}</p>
      </div>
    </article>
  );
}
