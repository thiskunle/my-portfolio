import { ContactSection } from "@/components/contact/ContactSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { StackSection } from "@/components/sections/StackSection";
import { StorySection } from "@/components/sections/StorySection";
import { WorkSection } from "@/components/sections/WorkSection";

export default function Home() {
  return (
    <main id="main">
      <OrganizationJsonLd />
      <HeroSection />
      <AboutSection />
      <ServicesShowcase />
      <WorkSection />
      <StorySection />
      <StackSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
