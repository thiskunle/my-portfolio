import { ContactSection } from "@/components/contact/ContactSection";
import { CursorTrackingHero } from "@/components/hero/CursorTrackingHero";
import { PricingSection } from "@/components/pricing/PricingSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { ServicesSection } from "@/components/services/ServicesSection";

export default function Home() {
  return (
    <main id="main">
      <OrganizationJsonLd />
      <CursorTrackingHero />
      <ServicesSection />
      <ProjectsSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
