import { company, contact, services, siteMetadata } from "@/lib/content";

/**
 * schema.org Organization built only from verified site content.
 * Deliberately omitted until supplied/confirmed: logo, image, address, sameAs (social profiles),
 * foundingDate, ratings and reviews.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${company.url}/#organization`,
    name: company.name,
    alternateName: company.shortName,
    url: company.url,
    slogan: company.tagline,
    description: siteMetadata.description,
    email: contact.email,
    telephone: contact.phone.href.replace("tel:", ""),
    founder: {
      "@type": "Person",
      name: company.founder.name,
      jobTitle: company.founder.role,
    },
    knowsAbout: services.map((service) => service.name),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
