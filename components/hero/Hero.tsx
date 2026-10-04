import { FounderVisual } from "@/components/hero/FounderVisual";
import { PerspectiveFloor } from "@/components/hero/PerspectiveFloor";
import { RoleRotator } from "@/components/hero/RoleRotator";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { hero, socialLinks } from "@/lib/content";

/**
 * Founder-led hero. Server-rendered; the only client islands are the role rotator
 * and the portrait tilt stage.
 */
export function Hero() {
  const hasSocial = socialLinks.some((link) => link.href !== null);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-clip pt-header lg:flex lg:min-h-svh lg:items-center"
    >
      <PerspectiveFloor />

      <Container className="grid items-center gap-14 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-7">
          <p className="mb-5 font-display text-eyebrow font-medium text-forest uppercase">
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="text-h1">
            {hero.greeting} <span className="text-forest">{hero.name}</span>
          </h1>

          <RoleRotator prefix={hero.rolePrefix} roles={hero.roles} />

          <p className="mt-7 max-w-[58ch] text-lead text-ink-2">{hero.description}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
              {hero.primaryCta.label}
            </Button>
            <Button
              href={hero.secondaryCta.href}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {hero.secondaryCta.label}
            </Button>
          </div>

          {hasSocial ? (
            <div className="mt-10 flex items-center gap-4 text-sm text-ink-2">
              <span>{hero.socialLabel}</span>
              <SocialLinks />
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <FounderVisual />
        </div>
      </Container>
    </section>
  );
}
