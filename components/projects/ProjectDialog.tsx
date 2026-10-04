"use client";

import type { ReactNode } from "react";
import { projectDialogId, projectDialogTitleId } from "@/components/projects/projectDialogs";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Native modal <dialog>: focus moves inside on open and returns to the opener on close,
 * Escape closes it, and the page behind is inert. Adds backdrop-click-to-close.
 * Content is passed in from the server.
 */
export function ProjectDialog({ projectId, children }: { projectId: string; children: ReactNode }) {
  return (
    <dialog
      id={projectDialogId(projectId)}
      aria-labelledby={projectDialogTitleId(projectId)}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(56rem,calc(100%-2rem))] overflow-y-auto rounded-panel bg-card p-0 text-ink shadow-lift backdrop:bg-scrim backdrop:backdrop-blur-sm open:motion-safe:animate-dialog-in"
      onClick={(event) => {
        // A click whose target is the <dialog> itself landed on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      {/* First in DOM so it receives initial focus. */}
      <form method="dialog" className="absolute top-3 right-3 z-10">
        <button
          type="submit"
          aria-label="Close project details"
          className={buttonStyles({ variant: "icon" })}
        >
          <Icon name="x" />
        </button>
      </form>
      {children}
    </dialog>
  );
}
