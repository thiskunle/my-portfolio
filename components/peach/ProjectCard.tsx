"use client";

import Image from "next/image";
import { cardTones, type CardTone } from "@/components/peach/cardTones";
import { PreviewMockup } from "@/components/peach/PreviewMockup";
import { useTilt } from "@/components/peach/useTilt";
import { Icon } from "@/components/ui/Icon";
import type { WorkProject } from "@/lib/content";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: WorkProject;
  index: number;
  tone: CardTone;
  pendingLabel: string;
  previewTag: string;
  viewLabel: string;
  onView: (project: WorkProject) => void;
};

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");

/** The project's artwork, or an illustrated storefront preview when there is none yet. */
export function ProjectVisual({ project, sizes }: { project: WorkProject; sizes: string }) {
  return project.image ? (
    <Image
      src={project.image.src}
      // alt is empty: the project name is always shown right beside the artwork.
      alt={project.image.alt}
      width={project.image.width}
      height={project.image.height}
      sizes={sizes}
      className="size-full object-cover"
    />
  ) : (
    <PreviewMockup name={project.name} />
  );
}

/**
 * A project shown as a browser window over a details panel. Enlarges and tilts slightly on
 * hover; "View project" opens the project viewer. Optional fields render only when present.
 */
export function ProjectCard({ project, index, tone, pendingLabel, previewTag, viewLabel, onView }: ProjectCardProps) {
  const tilt = useTilt<HTMLElement>(5, 1.03);
  const t = cardTones[tone];

  return (
    <article
      ref={tilt}
      className="group flex h-full flex-col overflow-clip rounded-card bg-snow text-wine shadow-lift will-change-transform"
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
        <div className="@container relative aspect-[16/10] overflow-clip">
          <div className="size-full transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-reduce:transition-none">
            <ProjectVisual project={project} sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 90vw" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-display font-semibold text-wine/60">{String(index + 1).padStart(2, "0")}</span>
          <span className="rounded-full bg-wine/8 px-3 py-1 font-semibold text-wine/80">
            {project.category ?? previewTag}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{project.name}</h3>
        <p className="mt-1.5 text-wine/70">{project.services ?? pendingLabel}</p>
        {project.summary ? <p className="mt-3 text-wine/75">{project.summary}</p> : null}
        <button
          type="button"
          onClick={() => onView(project)}
          className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 font-semibold text-wine underline decoration-wine/30 decoration-2 underline-offset-6 transition-colors hover:decoration-wine"
        >
          {viewLabel}
          <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          <span className="sr-only">: {project.name}</span>
        </button>
      </div>
    </article>
  );
}
