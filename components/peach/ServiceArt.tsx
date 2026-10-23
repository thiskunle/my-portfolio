import type { ReactNode } from "react";
import type { ServiceId } from "@/lib/content";
import { cn } from "@/lib/cn";

/*
 * Small line illustrations, one per service. Drawn in currentColor on a 120 × 96 grid so they
 * take the card's ink colour; the filled shapes use a low opacity of the same colour.
 */
const art: Record<ServiceId, ReactNode> = {
  "web-development": (
    <>
      <rect x="10" y="12" width="100" height="72" rx="8" />
      <path d="M10 28h100" />
      <circle cx="20" cy="20" r="2" className="fill-current" />
      <circle cx="28" cy="20" r="2" className="fill-current" />
      <circle cx="36" cy="20" r="2" className="fill-current" />
      <path d="M46 44l-10 10 10 10M74 44l10 10-10 10M64 40l-8 28" />
    </>
  ),
  cybersecurity: (
    <>
      <path d="M60 10l32 12v22c0 22-14 36-32 42-18-6-32-20-32-42V22z" />
      <path d="M60 10l32 12v22c0 22-14 36-32 42z" className="fill-current opacity-15" stroke="none" />
      <rect x="47" y="46" width="26" height="20" rx="4" />
      <path d="M52 46v-6a8 8 0 0116 0v6" />
      <circle cx="60" cy="56" r="2.5" className="fill-current" />
    </>
  ),
  "cloud-solutions": (
    <>
      <path d="M36 62h50a16 16 0 000-32 24 24 0 00-46-4 18 18 0 00-4 36z" />
      <path d="M40 62v12M60 62v18M80 62v12" />
      <circle cx="40" cy="78" r="4" />
      <circle cx="60" cy="84" r="4" className="fill-current" />
      <circle cx="80" cy="78" r="4" />
    </>
  ),
  "business-automation": (
    <>
      <rect x="8" y="38" width="22" height="20" rx="5" />
      <rect x="90" y="16" width="22" height="20" rx="5" />
      <rect x="90" y="60" width="22" height="20" rx="5" className="fill-current opacity-15" />
      <rect x="90" y="60" width="22" height="20" rx="5" />
      <path d="M30 48h18M72 48c8 0 8-22 18-22M72 48c8 0 8 22 18 22" />
      <path d="M60 36l12 12-12 12-12-12z" />
    </>
  ),
  "brand-identity": (
    <>
      <path d="M38 76l10-34 22-18 12 12-18 22z" />
      <path d="M48 42l18 18M38 76l16-16" />
      <circle cx="56" cy="58" r="3" className="fill-current" />
      <rect x="82" y="58" width="12" height="24" rx="3" className="fill-current opacity-15" />
      <rect x="96" y="50" width="12" height="32" rx="3" className="fill-current opacity-40" />
      <rect x="82" y="58" width="12" height="24" rx="3" />
      <rect x="96" y="50" width="12" height="32" rx="3" />
    </>
  ),
  "it-consulting": (
    <>
      <rect x="14" y="18" width="52" height="18" rx="4" />
      <rect x="14" y="40" width="52" height="18" rx="4" />
      <rect x="14" y="62" width="52" height="18" rx="4" className="fill-current opacity-15" />
      <rect x="14" y="62" width="52" height="18" rx="4" />
      <circle cx="24" cy="27" r="2" className="fill-current" />
      <circle cx="24" cy="49" r="2" className="fill-current" />
      <circle cx="24" cy="71" r="2" className="fill-current" />
      <path d="M78 30h28a6 6 0 016 6v18a6 6 0 01-6 6H94l-10 8v-8h-6a6 6 0 01-6-6V36a6 6 0 016-6z" />
      <path d="M84 42h16M84 49h10" />
    </>
  ),
};

export function ServiceArt({ id, className }: { id: ServiceId; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 120 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-20 w-auto sm:h-24", className)}
    >
      {art[id]}
    </svg>
  );
}
