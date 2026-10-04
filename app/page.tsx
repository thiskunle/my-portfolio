import { Hero } from "@/components/hero/Hero";
import { Container } from "@/components/ui/Container";

/*
 * TEMPORARY section anchors so the navigation and hero CTAs resolve while the real
 * sections are built. Each one is replaced in its own phase. Not a design.
 */
const temporaryAnchors = [
  { id: "features", label: "What We Do", note: "Services — Phase 4" },
  { id: "portfolio", label: "Recent Projects", note: "Projects — Phase 5" },
  { id: "pricing", label: "Pricing", note: "Pending verified pricing" },
  { id: "contacts", label: "Contact", note: "Contact — Phase 7" },
] as const;

export default function Home() {
  return (
    <main id="main">
      <Hero />

      {temporaryAnchors.map((anchor) => (
        <section
          key={anchor.id}
          id={anchor.id}
          aria-labelledby={`${anchor.id}-title`}
          className="border-t border-line"
        >
          <Container className="flex min-h-[60svh] items-center py-section">
            <div className="w-full rounded-card border border-dashed border-line p-10 text-center">
              <p className="font-display text-eyebrow text-ink-2 uppercase">
                Temporary anchor · {anchor.note}
              </p>
              <h2 id={`${anchor.id}-title`} className="mt-3 text-h3">
                {anchor.label}
              </h2>
            </div>
          </Container>
        </section>
      ))}
    </main>
  );
}
