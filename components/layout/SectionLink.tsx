"use client";

import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

/** Prefix that points a homepage "#section" link at the homepage when on another page. */
export function useHomePrefix() {
  return usePathname() === "/" ? "" : "/";
}

/** Link to a homepage section (href like "#work") that also works from other pages. */
export function SectionLink({ href, ...props }: ComponentPropsWithoutRef<"a"> & { href: string }) {
  const prefix = useHomePrefix();
  return <a href={`${prefix}${href}`} {...props} />;
}
