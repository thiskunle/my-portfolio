import { ContactLink } from "@/components/contact/ContactLink";
import { buttonStyles } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingSection, pricingTiers } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Pricing (#pricing). Three tiers in one ruled panel rather than floating cards; the recommended
 * tier is marked with a forest rule, a raised surface and a text badge (not colour alone).
 * Server-rendered; only the CTAs are client islands (they pre-fill the contact subject).
 */
export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-t border-line py-section">
      <Container>
        <SectionHeading id="pricing-title" title={pricingSection.title} description={pricingSection.intro} />

        <ul className="mt-14 grid overflow-hidden rounded-panel border border-line lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const recommended = Boolean(tier.badge);
            return (
              <li
                key={tier.id}
                aria-labelledby={`tier-${tier.id}-title`}
                className={cn(
                  "relative flex flex-col gap-6 border-line p-7 sm:p-10",
                  "not-first:border-t lg:not-first:border-t-0 lg:not-first:border-l",
                  recommended && "bg-card",
                )}
              >
                {recommended ? <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-forest" /> : null}

                <div className="flex min-h-7 items-center justify-between gap-4">
                  <p className="font-display text-eyebrow font-medium text-forest uppercase">{tier.name}</p>
                  {tier.badge ? (
                    <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-forest">
                      {tier.badge}
                    </span>
                  ) : null}
                </div>

                <h3 id={`tier-${tier.id}-title`} className="text-h3">
                  {tier.title}
                </h3>

                <p>
                  <span className="block text-sm text-ink-2">{tier.pricePrefix}</span>
                  <span className="mt-1.5 block font-display text-price font-bold">{tier.price}</span>
                </p>

                <p className="text-ink-2">{tier.description}</p>

                <ul className="grid gap-3 border-t border-line pt-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Icon name="check" className="mt-1 text-forest" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <ContactLink
                    subject={pricingSection.contactSubject(tier)}
                    className={buttonStyles({
                      variant: recommended ? "primary" : "secondary",
                      size: "lg",
                      className: "w-full",
                    })}
                  >
                    {tier.cta}
                    <span className="sr-only">: {tier.title}</span>
                  </ContactLink>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
