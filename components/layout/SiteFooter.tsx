import { Brand } from "@/components/layout/Brand";
import { SectionLink } from "@/components/layout/SectionLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { contact, footer, navigation } from "@/lib/content";

const columnHeading = "font-display text-eyebrow font-medium text-forest uppercase";
const footerLink =
  "inline-flex min-h-11 items-center gap-3 text-ink-2 transition-colors duration-200 hover:text-ink";

export function SiteFooter() {
  // Resolved at build time for the statically rendered page.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-12 md:gap-8 lg:py-24">
        <div className="md:col-span-6 lg:col-span-7">
          <Brand variant="full" />
          <p className="mt-6 max-w-[14ch] font-display text-h2 font-bold text-balance">
            {footer.tagline}
          </p>
        </div>

        <nav aria-labelledby="footer-nav-heading" className="md:col-span-3 lg:col-span-2">
          <h2 id="footer-nav-heading" className={columnHeading}>
            Navigate
          </h2>
          <ul className="mt-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <SectionLink href={item.href} className={footerLink}>
                  {item.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className={columnHeading}>Contact</h2>
          <ul className="mt-4">
            <li>
              <a href={`mailto:${contact.email}`} className={footerLink}>
                <Icon name="mail" className="text-forest" />
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phone.href} className={footerLink}>
                <Icon name="phone" className="text-forest" />
                {contact.phone.display}
              </a>
            </li>
          </ul>
          <SocialLinks className="mt-6" />
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-6">
        <p className="text-sm text-ink-2">
          © {year}. All rights reserved by {footer.rightsHolder}
        </p>
        <a href="/privacy" className="inline-flex min-h-11 items-center text-sm text-ink-2 transition-colors duration-200 hover:text-ink">
          Privacy Policy
        </a>
      </Container>
    </footer>
  );
}
