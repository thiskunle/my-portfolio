import { cn } from "@/lib/cn";

/**
 * Illustrated stand-in for a project that has no artwork yet: a beauty / e-commerce storefront
 * drawn as simple shapes (hero banner, product tiles, basket). It is clearly an illustration,
 * never a screenshot, and carries the project name only as a wordmark.
 */
export function PreviewMockup({ name, className }: { name: string; className?: string }) {
  return (
    <div aria-hidden className={cn("relative size-full overflow-clip bg-[#f7e3dd] text-wine", className)}>
      {/* Storefront header */}
      <div className="flex items-center justify-between px-[6%] pt-[5%]">
        <span className="font-display text-[clamp(0.7rem,2.6cqi,1rem)] font-extrabold tracking-[0.18em] uppercase">
          {name}
        </span>
        <span className="flex gap-[0.4em] text-[clamp(0.5rem,1.6cqi,0.7rem)]">
          <i className="block h-[0.5em] w-[2.4em] rounded-full bg-wine/25" />
          <i className="block h-[0.5em] w-[2.4em] rounded-full bg-wine/25" />
          <i className="block h-[0.5em] w-[2.4em] rounded-full bg-wine/25" />
          <i className="block size-[0.9em] rounded-full bg-wine/70" />
        </span>
      </div>

      {/* Hero banner: copy blocks beside a product silhouette */}
      <div className="mx-[6%] mt-[4%] flex h-[38%] items-center gap-[5%] rounded-[2.4cqi] bg-[#e9bfb4] px-[6%]">
        <div className="flex-1 space-y-[6%]">
          <i className="block h-[1.6cqi] w-[80%] rounded-full bg-wine/80" />
          <i className="block h-[1.6cqi] w-[60%] rounded-full bg-wine/80" />
          <i className="block h-[1cqi] w-[70%] rounded-full bg-wine/30" />
          <i className="mt-[10%] block h-[3.4cqi] w-[42%] rounded-full bg-wine" />
        </div>
        <svg viewBox="0 0 60 80" className="h-[82%] w-auto">
          <rect x="21" y="4" width="18" height="10" rx="3" className="fill-wine" />
          <rect x="14" y="14" width="32" height="62" rx="9" className="fill-[#fff6f2]" />
          <rect x="20" y="36" width="20" height="18" rx="3" className="fill-wine/20" />
        </svg>
      </div>

      {/* Product grid */}
      <div className="mx-[6%] mt-[4%] grid grid-cols-4 gap-[3%]">
        {[0.9, 0.7, 0.8, 0.6].map((tint, i) => (
          <div key={i} className="rounded-[1.6cqi] bg-[#fff6f2] p-[8%]">
            <div className="aspect-square rounded-[1cqi]" style={{ backgroundColor: `rgb(233 191 180 / ${tint})` }} />
            <i className="mt-[10%] block h-[0.9cqi] w-[80%] rounded-full bg-wine/40" />
            <i className="mt-[6%] block h-[0.9cqi] w-[45%] rounded-full bg-wine/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
