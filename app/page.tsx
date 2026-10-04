import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, hero, services } from "@/lib/content";

/*
 * Temporary Phase 1 foundation preview.
 * Exercises tokens, typography and base components in both themes.
 * Replaced by the real page sections from Phase 3 onward.
 */
export default function Home() {
  return (
    <main id="main" className="py-section">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          as="h1"
          eyebrow="Foundation preview"
          title={company.name}
          description={company.tagline}
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="secondary">
            {hero.secondaryCta.label}
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="icon" aria-label="Next">
            <Icon name="chevron-right" />
          </Button>
        </div>

        <ul className="grid gap-x-12 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={i * 0.06}>
              <Icon name={service.icon} className="text-2xl text-forest" />
              <h2 className="mt-4 text-h3">{service.name}</h2>
              <p className="mt-2 text-ink-2">{service.description}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </main>
  );
}
