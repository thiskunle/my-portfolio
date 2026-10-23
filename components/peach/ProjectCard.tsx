"use client";

import Image from "next/image";
import { cardTones, type CardTone } from "@/components/peach/cardTones";
import { useTilt } from "@/components/peach/useTilt";
import { Icon } from "@/components/ui/Icon";
import type { WorkProject } from "@/lib/content";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: WorkProject;
  index: number;
  tone: CardTone;
  pendingLabel: string;
};

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9 &]/g, " ")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/**
 * A project shown as a browser window over a details panel. Until GramByte supplies real
 * screenshots, the window holds a placeholder: the project's initials on a blueprint grid.
 * Optional fields (category, summary, url, image) render only when present.
 */
export function ProjectCard({ project, index, tone, pendingLabel }: ProjectCardProps) {
  const tilt = useTilt<HTMLElement>(6);
  const t = cardTones[tone];
  const pending = !project.summary;

  return (
    <article
      ref={tilt}
      className="flex h-full flex-col overflow-clip rounded-card bg-snow text-wine shadow-lift will-change-transform"
    >
      <div className={cn("m-3 mb-0 overflow-clip rounded-[1.1rem]", t.surface)}>
        <div className={cn("flex items-center gap-1.5 border-b px-4 py-3", t.line, t.ink)}>
          <i aria-hidden className="size-2.5 rounded-full bg-current opacity-35" />
          <i aria-hidden className="size-2.5 rounded-full bg-current opacity-35" />
          <i aria-hidden className="size-2.5 rounded-full bg-current opacity-35" />
          <span className={cn("ml-3 truncate font-display text-xs font-semibold", t.muted)}>
            {slug(project.name)}
          </span>
        </div>
        <div className="relative aspect-[16/10]">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 90vw"
              // alt is empty: the project name is the card's heading right below.
              className="size-full object-cover"
            />
          ) : (
            <div
              aria-hidden
              className={cn("gb-grid-face grid size-full place-items-center", t.ink)}
            >
              <span className="font-display text-[clamp(3rem,2rem+3vw,4.5rem)] font-extrabold tracking-tight opacity-90">
                {initials(project.name)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-display font-semibold text-wine/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-wine/8 px-3 py-1 font-semibold text-wine/80">
            {project.category ?? pendingLabel}
          </span>
        </div>
        <h3 className="mt-4 font-display text-h3 font-extrabold uppercase">{project.name}</h3>
        {pending ? null : <p className="mt-3 text-wine/75">{project.summary}</p>}
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-wine underline-offset-4 hover:underline"
          >
            View project
            <Icon name="arrow-right" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
