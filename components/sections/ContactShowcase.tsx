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
 * Contact: one large card. The closing headline, a prompt and the contact form sit on the
 * light side; the founder portrait fills the red side. The form keeps the original #contacts
 * anchor that startContact() in lib/contact/prefill.ts scrolls to.
 */
export function ContactShowcase() {
  const root = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: "[data-contact-card]", start: "top 75%" } })
        .from("[data-contact-card]", { y: 80, scale: 0.96, autoAlpha: 0, duration: 1.1 })
        .from("[data-contact-line]", { yPercent: 110, stagger: 0.1, duration: 1 }, 0.25)
        .from("[data-contact-fade]", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8 }, 0.5)
        .from("[data-contact-photo]", { yPercent: 20, rotate: 6, autoAlpha: 0, duration: 1.1, ease: "back.out(1.5)" }, 0.3);
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
          className="grid overflow-clip rounded-[2rem] bg-card shadow-lift ring-1 ring-line sm:rounded-[2.5rem] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"
        >
          <div className="p-7 sm:p-12 lg:p-14 xl:p-16">
            <span
              data-contact-fade
              className="inline-flex items-center gap-2 rounded-full bg-ink/6 px-4 py-2 font-display text-sm font-semibold"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {contact.eyebrow}
            </span>
            <h2 id="contact-title" className="mt-6 font-display text-hero font-extrabold text-wine uppercase">
              {contactShowcase.headline.map((line) => (
                <span key={line} className="-mb-[0.08em] block overflow-clip pb-[0.08em]">
                  <span data-contact-line className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h2>
            <p data-contact-fade className="mt-6 max-w-[30ch] font-display text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] leading-snug font-semibold">
              {contactShowcase.prompt}
            </p>

            <div id={CONTACT_SECTION_ID} data-contact-fade className="mt-8 scroll-mt-28">
              <ContactForm compact submitLabel={contactShowcase.submitLabel} />
            </div>

            <div data-contact-fade className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-8">
              <div className="flex items-center gap-2">
                <Icon name="mail" className="text-lg text-accent" />
                <a
                  href={`mailto:${contactShowcase.email}`}
                  className="font-display text-lg font-bold underline-offset-4 hover:underline"
                  aria-label={`${contactShowcase.emailLabel}: ${contactShowcase.email}`}
                >
                  {contactShowcase.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="ml-1 min-h-9 rounded-full px-3 text-sm font-semibold ring-1 ring-line transition-colors ring-inset hover:bg-forest hover:text-on-forest"
                >
                  <span aria-live="polite">
                    {copied ? `${contactShowcase.copiedLabel} ✓` : contactShowcase.copyLabel}
                  </span>
                </button>
              </div>
              <p className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.14em] uppercase">
                <Icon name="compass" className="text-accent" />
                {contactShowcase.locations}
              </p>
            </div>
          </div>

          <div className="relative min-h-96 bg-[var(--gb-red)] lg:min-h-full">
            <div aria-hidden className="gb-grid-face absolute inset-0 opacity-60" />
            {/* Sticks beside the form on large screens so the portrait stays in view. */}
            <div className="lg:sticky lg:top-24 lg:h-[min(44rem,calc(100dvh-7rem))]">
              <div
                data-contact-photo
                className="absolute inset-x-8 top-10 bottom-0 overflow-clip rounded-t-[1.75rem] ring-8 ring-snow sm:inset-x-14 lg:inset-x-10 lg:top-14"
              >
                <Image
                  src={contact.portrait.src}
                  alt={contact.portrait.alt}
                  fill
                  sizes="(min-width: 1024px) 28rem, 90vw"
                  className="object-cover object-[50%_22%]"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
