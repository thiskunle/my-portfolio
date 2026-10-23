"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { contact, contactShowcase } from "@/lib/content";
import { CONTACT_SECTION_ID } from "@/lib/contact/prefill";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Contact: a large snow card with the closing headline, email (with copy) and markets, and the
 * existing contact form beneath it. The form keeps the original #contacts anchor that
 * startContact() in lib/contact/prefill.ts scrolls to.
 */
export function ContactShowcase() {
  const root = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: "[data-contact-card]", start: "top 75%" } })
        .from("[data-contact-card]", { y: 80, scale: 0.95, autoAlpha: 0, duration: 1.1 })
        .from("[data-contact-line]", { yPercent: 110, stagger: 0.1, duration: 1 }, 0.25)
        .from("[data-contact-fade]", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8 }, 0.5)
        .from("[data-contact-photo]", { yPercent: 25, rotate: 10, autoAlpha: 0, duration: 1.1, ease: "back.out(1.5)" }, 0.3);
    },
    { scope: root },
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactShowcase.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); the mailto link remains.
    }
  }

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="gb-section gb-section-cream relative py-section">
      <CurvedEdge flip />
      <Container>
        <div
          data-contact-card
          className="relative grid overflow-clip rounded-[2rem] bg-snow text-wine shadow-lift sm:rounded-[2.5rem] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
        >
          <div className="p-7 sm:p-12 lg:p-16">
            <span
              data-contact-fade
              className="inline-flex items-center gap-2 rounded-full bg-wine/8 px-4 py-2 font-display text-sm font-semibold"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-wine" />
              {contact.eyebrow}
            </span>
            <h2 id="contact-title" className="mt-6 font-display text-hero font-extrabold uppercase">
              {contactShowcase.headline.map((line) => (
                <span key={line} className="-mb-[0.08em] block overflow-clip pb-[0.08em]">
                  <span data-contact-line className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p data-contact-fade className="mt-6 max-w-[46ch] text-wine/80">
              {contactShowcase.intro}
            </p>

            <div data-contact-fade className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={contactShowcase.cta.href}
                className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-wine px-7 font-semibold text-snow shadow-[0_18px_40px_-14px_rgb(102_10_26/0.6)] transition-[background-color,translate] duration-200 hover:-translate-y-0.5 hover:bg-[var(--gb-red)] motion-reduce:hover:translate-y-0"
              >
                {contactShowcase.cta.label}
                <Icon name="arrow-right" />
              </a>
            </div>

            <div data-contact-fade className="mt-8 flex flex-wrap items-center gap-2 rounded-3xl bg-wine/6 p-1.5 pl-5 sm:inline-flex sm:rounded-full">
              <Icon name="mail" className="text-lg" />
              <a
                href={`mailto:${contactShowcase.email}`}
                className="font-display text-lg font-bold underline-offset-4 hover:underline sm:text-xl"
                aria-label={`${contactShowcase.emailLabel}: ${contactShowcase.email}`}
              >
                {contactShowcase.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="ml-auto min-h-10 rounded-full bg-snow px-4 text-sm font-semibold ring-1 ring-wine/20 transition-colors hover:bg-wine hover:text-snow"
              >
                <span aria-live="polite">
                  {copied ? `${contactShowcase.copiedLabel} ✓` : contactShowcase.copyLabel}
                </span>
              </button>
            </div>

            <p data-contact-fade className="mt-6 flex items-center gap-2 font-display font-bold tracking-[0.12em] uppercase">
              <Icon name="compass" />
              {contactShowcase.locations}
            </p>
          </div>

          <div className="relative min-h-80 bg-[var(--gb-red)] lg:min-h-full">
            <div aria-hidden className="gb-grid-face absolute inset-0 opacity-60" />
            <div
              data-contact-photo
              className="absolute inset-x-8 top-10 bottom-0 overflow-clip rounded-t-[1.75rem] ring-8 ring-snow sm:inset-x-14 lg:top-16"
            >
              <Image
                src={contact.portrait.src}
                alt={contact.portrait.alt}
                fill
                sizes="(min-width: 1024px) 32rem, 90vw"
                className="object-cover object-[50%_22%]"
              />
            </div>
          </div>
        </div>

        <div id={CONTACT_SECTION_ID} className="mx-auto mt-16 max-w-4xl scroll-mt-28 sm:mt-24">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
