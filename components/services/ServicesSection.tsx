import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, servicesSection } from "@/lib/content";

/**
 * "What We Do". Keeps the original #features anchor. Content comes from lib/content.ts and is
 * fully present in the server HTML; ServicesExplorer adds selection and the cube.
 */
export function ServicesSection() {
  return (
    <section
      id="features"
      aria-labelledby="services-title"
      className="overflow-x-clip border-t border-line py-section"
    >
      <Container>
        <ServicesExplorer
          services={services}
          heading={
            <SectionHeading
              id="services-title"
              title={servicesSection.title}
              description={servicesSection.intro}
            />
          }
        />
      </Container>
    </section>
  );
}
