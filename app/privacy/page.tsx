import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { privacyPage } from "@/lib/content";

export const metadata: Metadata = {
  title: privacyPage.title,
  description: privacyPage.description,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy", title: privacyPage.title, description: privacyPage.description },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="gb-section gb-section-cream pt-36 pb-section text-ink sm:pt-44">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-editorial font-bold">{privacyPage.title}</h1>
          <p className="mt-5 text-sm text-ink-2">Last updated: {privacyPage.updated}</p>
          <p className="mt-8 text-lead">{privacyPage.intro}</p>

          {privacyPage.sections.map((section) => (
            <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="mt-12">
              <h2 id={`privacy-${section.id}`} className="font-display text-h3 font-bold">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-ink-2">
                  {paragraph}
                </p>
              ))}
              {section.list ? (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-2">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
