import { brandAssets, company, contact, hero, services, siteMetadata } from "@/lib/content";

/**
 * schema.org Organization built only from verified site content, including the genuine logo
 * and founder photo. Deliberately omitted until supplied/confirmed: address, sameAs (social
 * profiles), foundingDate, ratings and reviews.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${company.url}/#organization`,
    name: company.name,
    alternateName: company.shortName,
    url: company.url,
    logo: `${company.url}${brandAssets.logo.src}`,
    slogan: company.tagline,
    description: siteMetadata.description,
    email: contact.email,
    telephone: contact.phone.href.replace("tel:", ""),
    founder: {
      "@type": "Person",
      name: company.founder.name,
      jobTitle: company.founder.role,
      ...(hero.portrait ? { image: `${company.url}${hero.portrait.src}` } : {}),
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
