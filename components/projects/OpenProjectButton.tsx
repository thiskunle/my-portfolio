"use client";

import type { ReactNode } from "react";
import { openProjectDialog, projectDialogId } from "@/components/projects/projectDialogs";

export function OpenProjectButton({
  projectId,
  className,
  children,
}: {
  projectId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-controls={projectDialogId(projectId)}
      className={className}
      onClick={() => openProjectDialog(projectId)}
    >
      {children}
    </button>
  );
}
