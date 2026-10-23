"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;

function subscribe(onChange: () => void) {
  // Tick on the next minute boundary, then every minute after it.
  let interval = 0;
  const timeout = window.setTimeout(() => {
    onChange();
    interval = window.setInterval(onChange, MINUTE);
  }, MINUTE - (Date.now() % MINUTE));
  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}

/** Start of the current minute, as a stable snapshot until the minute changes. */
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE;

/** The current time rounded down to the minute; null while server rendering. */
export function useMinuteClock(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
