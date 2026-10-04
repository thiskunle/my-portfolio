import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_SECTION_ID } from "@/lib/contact/prefill";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { company, contact } from "@/lib/content";

const contactLine =
  "inline-flex min-h-11 items-center gap-3 font-medium text-face-ink transition-colors duration-200 hover:text-face-accent";

/**
 * Contact (#contacts, original anchor): the founder panel and the form. Server-rendered apart
 * from the form itself.
 */
export function ContactSection() {
  return (
    <section
      id={CONTACT_SECTION_ID}
      aria-labelledby="contact-title"
      className="border-t border-line py-section"
    >
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading id="contact-title" title={contact.title} />

          <div className="relative mt-10 overflow-hidden rounded-panel bg-face p-7 text-face-ink sm:p-10">
            <div aria-hidden className="gb-face-grid absolute inset-0 [--cube:12rem]" />
            <div className="relative">
              <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-card ring-1 ring-face-line ring-inset">
                <Image
                  src={contact.portrait.src}
                  alt={contact.portrait.alt}
                  fill
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 36rem, 90vw"
                  className="object-cover object-[50%_22%]"
                />
              </div>
              <h3 className="text-h3 text-face-ink">{company.founder.name}</h3>
              <p className="mt-1 font-medium text-face-accent">{company.founder.role}</p>
              <p className="mt-6 text-face-ink-2">{contact.intro}</p>

              <ul className="mt-8 grid gap-1">
                <li>
                  <a href={contact.phone.href} className={contactLine}>
                    <Icon name="phone" className="text-lg text-face-accent" />
                    {contact.phone.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className={contactLine}>
                    <Icon name="mail" className="text-lg text-face-accent" />
                    {contact.email}
                  </a>
                </li>
              </ul>

              <SocialLinks className="mt-8" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-2">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
