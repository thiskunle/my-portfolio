import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactShowcase } from "@/components/sections/ContactShowcase";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { StackSection } from "@/components/sections/StackSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { StorySection } from "@/components/sections/StorySection";
import { WorkSection } from "@/components/sections/WorkSection";

/*
 * Peach-style homepage. The previous sections (components/hero, services, projects, pricing,
 * contact/ContactSection) are kept in the repo, unused, so they can be restored; the
 * pre-peach-redesign git tag holds the full previous site.
 */
export default function Home() {
  return (
    // overflow-x-clip: cards start off to the side before animating in; clip (unlike hidden)
    // creates no scroll container, so the curved section edges and ScrollTrigger are unaffected.
    <main id="main" className="overflow-x-clip">
      <OrganizationJsonLd />
      <HeroSection />
      <AboutSection />
      <ServicesShowcase />
      <WorkSection />
      <StorySection />
      <StackSection />
      <StatsSection />
      <ContactShowcase />
    </main>
  );
}
