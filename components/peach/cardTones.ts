/** Surface colours for the showcase cards; cycle through them so neighbours differ. */
export type CardTone = "face" | "red" | "snow" | "blush";

export const cardTones: Record<CardTone, { surface: string; ink: string; muted: string; line: string }> = {
  face: {
    surface: "bg-face ring-1 ring-face-line",
    ink: "text-face-ink",
    muted: "text-face-ink-2",
    line: "border-face-line",
  },
  red: {
    surface: "bg-[var(--gb-red)]",
    ink: "text-snow",
    muted: "text-snow/80",
    line: "border-white/25",
  },
  snow: {
    surface: "bg-snow",
    ink: "text-wine",
    muted: "text-wine/75",
    line: "border-wine/15",
  },
  blush: {
    surface: "bg-blush",
    ink: "text-wine",
    muted: "text-wine/80",
    line: "border-wine/15",
  },
};
