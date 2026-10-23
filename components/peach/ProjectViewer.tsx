"use client";

import { useEffect, useRef } from "react";
import { ProjectVisual } from "@/components/peach/ProjectCard";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { WorkProject } from "@/lib/content";
import { startContact } from "@/lib/contact/prefill";

type ProjectViewerProps = {
  project: WorkProject | null;
  labels: {
    pendingLabel: string;
    similarCta: string;
    previewNote: string;
  };
  onClose: () => void;
};

/**
 * Native modal <dialog> showing a project large: artwork, name, service types and a link to
 * start a similar project (pre-fills the contact form). Escape, the close button and a
 * backdrop click all close it; focus returns to the opener.
 */
export function ProjectViewer({ project, labels, onClose }: ProjectViewerProps) {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (project && !el.open) el.showModal();
    if (!project && el.open) el.close();
  }, [project]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-viewer-title"
      onClose={onClose}
      onClick={(event) => {
        // A click whose target is the <dialog> itself landed on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(60rem,calc(100%-2rem))] overflow-y-auto rounded-panel bg-snow p-0 text-wine shadow-lift backdrop:bg-scrim backdrop:backdrop-blur-sm open:motion-safe:animate-dialog-in"
    >
      {project ? (
        <>
          <form method="dialog" className="absolute top-3 right-3 z-10">
            <button type="submit" aria-label="Close project" className={buttonStyles({ variant: "icon" })}>
              <Icon name="x" />
            </button>
          </form>
          <div className="@container aspect-[16/10] max-h-[60dvh] w-full overflow-clip bg-face">
            <ProjectVisual project={project} sizes="(min-width: 1024px) 60rem, 100vw" />
          </div>
          <div className="grid gap-6 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              {project.category ? (
                <p className="font-display text-sm font-bold tracking-[0.2em] text-wine/60 uppercase">
                  {project.category}
                </p>
              ) : null}
              <h3 id="project-viewer-title" className="mt-2 font-display text-h3 font-extrabold tracking-tight sm:text-[clamp(2rem,1.4rem+1.6vw,2.75rem)]">
                {project.name}
              </h3>
              <p className="mt-2 text-lead text-wine/75">{project.services ?? labels.pendingLabel}</p>
              {project.description ? <p className="mt-4 max-w-[60ch] text-wine/75">{project.description}</p> : null}
              {project.image ? null : <p className="mt-4 text-sm text-wine/60">{labels.previewNote}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-13 items-center gap-2 rounded-full px-6 font-semibold ring-2 ring-wine/30 ring-inset hover:ring-wine"
                >
                  Visit site
                  <Icon name="arrow-right" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  dialog.current?.close();
                  startContact(`Project like: ${project.name}`);
                }}
                className="inline-flex min-h-13 items-center gap-2 rounded-full bg-wine px-6 font-semibold text-snow transition-colors hover:bg-[var(--gb-red)]"
              >
                {labels.similarCta}
                <Icon name="arrow-right" />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
