/** Shared motion values. Mirrors the --ease-out-expo token in app/globals.css. */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const;

/** Durations in seconds, kept within the 200–700ms range set by the design rules. */
export const durations = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
} as const;
