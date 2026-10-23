import { ContactSection } from "@/components/contact/ContactSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/services/ServicesSection";

export default function Home() {
  return (
    <main id="main">
      <OrganizationJsonLd />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
