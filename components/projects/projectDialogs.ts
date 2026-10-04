/** Shared ids for the server-rendered project dialogs and the controls that open them. */
export const projectDialogId = (projectId: string) => `project-${projectId}`;
export const projectDialogTitleId = (projectId: string) => `project-${projectId}-title`;

/** Browser-only: opens a project's dialog as a modal. */
export function openProjectDialog(projectId: string) {
  const dialog = document.getElementById(projectDialogId(projectId));
  if (dialog instanceof HTMLDialogElement && !dialog.open) dialog.showModal();
}
