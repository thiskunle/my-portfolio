import { ContactSection } from "@/components/contact/ContactSection";
import { Hero } from "@/components/hero/Hero";
import { PricingSection } from "@/components/pricing/PricingSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { ServicesSection } from "@/components/services/ServicesSection";

export default function Home() {
  return (
    <main id="main">
      <OrganizationJsonLd />
      <Hero />
      <ServicesSection />
      <ProjectsSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
