/**
 * Verified GramByte content.
 *
 * Sources:
 *   - reference/current-website.html (copy, contact details, projects, roles)
 *   - .claude/skills/frontend-design/SKILL.md (canonical service descriptions, CTA labels)
 *
 * Do not add claims, clients, metrics or outcomes here without confirmation.
 * Pricing is copied verbatim from the reference site; no currency code is stated there,
 * so none is added here.
 */

import type { IconName } from "@/components/ui/Icon";

/* ── Company ─────────────────────────────────────────── */

export const company = {
  name: "GramByte Technologies Inc.",
  shortName: "GramByte",
  tagline: "Pure. Authentic. Original.",
  domain: "grambyte.ca",
  url: "https://grambyte.ca",
  founder: {
    name: "Ade Akeju",
    role: "Founder",
  },
} as const;

/**
 * Genuine brand artwork from the previous GramByte site. The original files contain no
 * standalone logo, so these are lossless pixel crops of the logo on the old vertical brand card
 * (assets/images/logo/logo-vertical.png), on its original #30363f background.
 */
export const brandAssets = {
  /** Hand-and-sprout mark only. 232 × 191. */
  mark: { src: "/images/brand/grambyte-mark.png", width: 232, height: 191 },
  /** Mark + "GramByte Technologies Inc." wordmark. 692 × 309. */
  logo: { src: "/images/brand/grambyte-logo.png", width: 692, height: 309 },
} as const;

export const siteMetadata = {
  title: `${company.name} — ${company.founder.name}`,
  description:
    "GramByte Technologies Inc. helps businesses grow through web development, cybersecurity, cloud solutions, automation, branding, and digital transformation.",
} as const;

/** Social share card, rendered at build time by app/og-image.png/route.tsx. */
export const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${company.name} — ${company.tagline}`,
} as const;

/* ── Navigation ──────────────────────────────────────── */

export type NavItem = {
  label: string;
  href: `#${string}`;
};

/* Section ids of the Peach-style homepage (components/sections). Pricing returns once verified. */
export const navigation: readonly NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Story", href: "#story" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

/* ── Hero ────────────────────────────────────────────── */

export type PortraitImage = {
  /** Path under /public, e.g. "/images/founder/ade-akeju.jpg". Displayed at a 4:5 crop. */
  src: string;
  alt: string;
};

export const roles: readonly string[] = [
  "Software Developer",
  "Professional Coder",
  "Cybersecurity Analyst",
  "Business Analyst",
];

export const hero = {
  eyebrow: "Welcome to GramByte Technologies Inc.",
  greeting: "Hi, I’m",
  name: company.founder.name,
  rolePrefix: "a",
  roles,
  // Original copy. May be tightened later with approval; meaning must be preserved.
  description:
    "GramByte Technologies Inc. helps businesses grow through web development, cybersecurity, cloud solutions, automation, branding, and digital transformation. We build modern, responsive, and secure digital systems that improve business operations, strengthen customer experience, and support long-term growth. We also use clean design, animation, and interactive web features to make business websites more engaging and professional.",
  primaryCta: { label: "Start a Project", href: "#contacts" },
  secondaryCta: { label: "View Recent Projects", href: "#portfolio" },
  socialLabel: "Find us",
  /** Genuine founder photo (previous site's hero image). Set to null to fall back to the monogram. */
  portrait: {
    src: "/images/founder/ade-akeju-hero.png",
    alt: "Ade Akeju, founder of GramByte Technologies Inc.",
  } as PortraitImage | null,
  /** Services shown as floating indicators around the founder portrait. */
  featuredServiceIds: [
    "web-development",
    "cybersecurity",
    "cloud-solutions",
  ] as const satisfies readonly ServiceId[],
} as const;

/** Copy for the cursor-tracking homepage hero. */
export const cursorHero = {
  eyebrow: company.name,
  title: "Building Technology for Businesses Ready to Grow.",
  description:
    "Web development, cybersecurity, cloud solutions, automation and digital products built for real business needs.",
  primaryCta: { label: "View Our Work", href: "#portfolio" },
  secondaryCta: hero.primaryCta,
} as const;

/* ── Services ────────────────────────────────────────── */

export type ServiceId =
  | "web-development"
  | "cybersecurity"
  | "cloud-solutions"
  | "business-automation"
  | "brand-identity"
  | "it-consulting";

export type Service = {
  id: ServiceId;
  name: string;
  icon: IconName;
  description: string;
};

export const services: readonly Service[] = [
  {
    id: "web-development",
    name: "Web Development",
    icon: "code",
    description:
      "Professional business websites, landing pages, e-commerce platforms, and custom web applications built around speed, security, usability, and business goals.",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "shield",
    description:
      "Security assessments, vulnerability testing, monitoring, cybersecurity awareness, and protection for businesses.",
  },
  {
    id: "cloud-solutions",
    name: "Cloud Solutions",
    icon: "cloud",
    description:
      "Cloud setup, Google Workspace, migration, business email systems, collaboration tools, and cloud infrastructure.",
  },
  {
    id: "business-automation",
    name: "Business Automation",
    icon: "cpu",
    description:
      "Workflow automation, AI-assisted systems, CRM workflows, integrations, and operational improvements.",
  },
  {
    id: "brand-identity",
    name: "Brand Identity",
    icon: "pen",
    description:
      "Business branding, logos, business cards, email signatures, digital assets, and supporting visual systems.",
  },
  {
    id: "it-consulting",
    name: "IT Consulting",
    icon: "compass",
    description: "Technology planning and technical support for startups and growing businesses.",
  },
];

export const servicesSection = {
  eyebrow: "Services",
  title: "What We Do",
  intro: "Six services, one partner.",
} as const;

/* ── Projects ────────────────────────────────────────── */

export type ProjectCategory =
  | "Web Development"
  | "Business Systems"
  | "Cybersecurity"
  | "Automation"
  | "Cloud"
  | "Digital Branding";

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  category: ProjectCategory;
  icon: IconName;
  title: string;
  /** Original summary copy. */
  summary: string;
  /** Original "Includes …" scope copy. */
  scope: string;
  /*
   * Optional verified details. Leave undefined until confirmed;
   * components must render nothing for missing fields.
   */
  problem?: string;
  outcome?: string;
  technologies?: readonly string[];
  /**
   * Genuine project artwork from the previous site, in its original order. alt is empty because
   * the project title is always shown beside it, and descriptions must not infer client names
   * or technologies from what appears in the artwork.
   */
  image?: ProjectImage;
};

export const projects: readonly Project[] = [
  {
    id: "business-website-email",
    category: "Web Development",
    icon: "monitor",
    title: "Business Website & Email Infrastructure",
    summary:
      "A responsive business website built to improve online presence, lead generation, and customer trust.",
    scope:
      "Includes branded email setup, contact form, mobile design, SEO structure, and secure website configuration.",
    image: { src: "/images/projects/business-website-email.png", alt: "", width: 800, height: 600 },
  },
  {
    id: "custom-business-platform",
    category: "Business Systems",
    icon: "layers",
    title: "Custom Business Platform Development",
    summary:
      "A tailored business platform built to streamline internal operations, client management, and team collaboration.",
    scope:
      "Includes custom dashboards, user role management, data reporting tools, API integrations, and scalable cloud hosting.",
    image: { src: "/images/projects/custom-business-platform.jpg", alt: "", width: 800, height: 600 },
  },
  {
    id: "cybersecurity-audit",
    category: "Cybersecurity",
    icon: "shield",
    title: "Cybersecurity Audit & Protection",
    summary:
      "A full cybersecurity assessment performed for a mid-sized business to identify vulnerabilities and strengthen their digital defenses.",
    scope:
      "Includes network vulnerability scan, firewall review, staff phishing awareness training, security policy setup, and incident response plan.",
    image: { src: "/images/projects/cybersecurity-audit.jpg", alt: "", width: 800, height: 600 },
  },
  {
    id: "workflow-automation",
    category: "Automation",
    icon: "settings",
    title: "Business Workflow Automation",
    summary:
      "An end-to-end automation solution built for a service business to eliminate manual tasks and reduce operational overhead.",
    scope:
      "Includes CRM integration, automated email sequences, invoice generation, appointment booking, and real-time performance tracking.",
    image: { src: "/images/projects/workflow-automation.jpg", alt: "", width: 800, height: 600 },
  },
  {
    id: "google-workspace-deployment",
    category: "Cloud",
    icon: "cloud",
    title: "Google Workspace Deployment",
    summary:
      "A complete Google Workspace setup and migration for a growing business transitioning from outdated email and file systems.",
    scope:
      "Includes domain verification, Gmail business setup, Google Drive migration, team calendar configuration, and admin console management.",
    image: { src: "/images/projects/google-workspace-deployment.jpg", alt: "", width: 800, height: 600 },
  },
  {
    id: "digital-branding",
    category: "Digital Branding",
    icon: "briefcase",
    title: "Digital Branding & Business Identity",
    summary:
      "A complete digital branding package created for a new business launching across web and social media channels.",
    scope:
      "Includes logo design, brand color guide, email signature, business card, social media kit, and branded document templates.",
    // Lossless crop of the product photo inside the old site's popup screenshot (portfolio-06.png),
    // so no old interface is shown inside the new project dialog.
    image: { src: "/images/projects/digital-branding.png", alt: "", width: 326, height: 359 },
  },
];

export const projectsSection = {
  eyebrow: "Portfolio",
  title: "Recent Projects",
  projectCta: "Start a similar project",
  /** Contact subject used by "Start a similar project" (original site wording). */
  contactSubject: (project: Pick<Project, "title">) => `Project like: ${project.title}`,
} as const;

/* ── Pricing ─────────────────────────────────────────── */

export type PricingTier = {
  id: string;
  name: string;
  title: string;
  description: string;
  features: readonly string[];
  badge?: string;
};

export const pricingSection = {
  eyebrow: "Packages",
  title: "Ways to Work Together",
  intro:
    "Flexible solutions for every stage of your business, from a focused web presence to custom systems and automation.",
  /** Shared by every tier; the contact subject below still identifies the package. */
  cta: "Request a Quote",
  /** Contact subject used by tier CTAs (original site wording). */
  contactSubject: (tier: Pick<PricingTier, "name" | "title">) => `${tier.name} plan: ${tier.title}`,
} as const;

export const pricingTiers: readonly PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    title: "Basic Website Package",
    description:
      "A clean one-page website for startups, personal brands, and small businesses that need a professional online presence.",
    features: [
      "One page built with Elementor",
      "Design customization",
      "Responsive design",
      "Content upload",
      "2 plugins or extensions",
    ],
  },
  {
    id: "business",
    name: "Business",
    title: "Business Website + Email Setup",
    description:
      "A complete business website package with branded email setup, contact form, responsive pages, SEO basics, and Google Workspace support.",
    features: [
      "Responsive multi-page website",
      "Branded email setup",
      "Contact form",
      "SEO basics",
      "Google Workspace support",
    ],
    badge: "Recommended",
  },
  {
    id: "premium",
    name: "Premium",
    title: "Custom Development & Automation",
    description:
      "Custom web development, business automation, cloud setup, cybersecurity support, and workflow tools tailored to your business needs.",
    features: [
      "Custom web development",
      "Business automation",
      "Cloud setup",
      "Cybersecurity support",
      "Workflow tools for your team",
    ],
  },
];

/* ── Contact ─────────────────────────────────────────── */

export const contact = {
  eyebrow: "Contact",
  title: "Let’s Talk About Your Project",
  email: "info@grambyte.ca",
  phone: {
    display: "416-828-6764",
    href: "tel:+14168286764",
  },
  intro:
    "Contact GramByte Technologies Inc. for websites, cybersecurity support and awareness training, cloud setup, branding, and business technology services.",
  /** Genuine founder portrait (previous site's contact image). Decorative beside the founder's name. */
  /* Backdrop recoloured to the site red with recolor_backdrop() in build_direction_frames.py. */
  portrait: { src: "/images/contact/ade-akeju-portrait-red.jpg", alt: "" } as PortraitImage,
} as const;

/* ── Social ──────────────────────────────────────────── */

export type SocialLink = {
  id: "facebook" | "instagram" | "linkedin";
  label: string;
  icon: IconName;
  /** null until the real profile URL is supplied. Components must not render a dead link. */
  href: string | null;
};

export const socialLinks: readonly SocialLink[] = [
  { id: "facebook", label: "Facebook", icon: "facebook", href: null },
  { id: "instagram", label: "Instagram", icon: "instagram", href: null },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin", href: null },
];

/* ── Footer ──────────────────────────────────────────── */

export const footer = {
  tagline: company.tagline,
  rightsHolder: company.name,
} as const;

/* ══ Peach-style homepage (peach-redesign) ══════════════
 * Content for the GSAP-driven sections in components/sections. Copy comes from the
 * redesign brief; service descriptions reuse the canonical ones above.
 */

export const peachHero = {
  /** Each entry renders on its own line. */
  headline: ["We build", "digital experiences", "that work."],
  /** Ending of the last headline line that gets the hand-drawn underline. */
  accent: "work.",
  description:
    "Web development, cybersecurity, cloud solutions, automation and digital solutions for modern businesses.",
  primaryCta: { label: "Start a Project", href: "#contact" },
  secondaryCta: { label: "Explore Our Work", href: "#work" },
  /** Note beside the cursor-tracking character; touch screens get their own wording. */
  pointerNote: { mouse: "Move your cursor. We’re paying attention.", touch: "Touch and drag. We’re paying attention." },
} as const;

export type Location = {
  id: string;
  /** City or country as GramByte names the market. */
  name: string;
  /** Country, shown under a city name. Omitted when the name is already a country. */
  region?: string;
  /** IANA time zone for the live local-time readout. */
  timeZone: string;
  /** Optional verified detail (e.g. office type). Render nothing when missing. */
  note?: string;
};

export const aboutSection = {
  eyebrow: "About GramByte",
  title: "One team,",
  /** Highlighted continuation of the title. */
  accent: "three markets",
  intro: siteMetadata.description,
  stackHint: "Click the cards to flip through our markets",
  localTimeLabel: "Local time",
  locations: [
    { id: "toronto", name: "Toronto", region: "Canada", timeZone: "America/Toronto" },
    { id: "manchester", name: "Manchester", region: "United Kingdom", timeZone: "Europe/London" },
    { id: "nigeria", name: "Nigeria", timeZone: "Africa/Lagos" },
  ] as readonly Location[],
} as const;

const serviceCardNames: Record<ServiceId, string> = {
  "web-development": "Web Development",
  cybersecurity: "Cybersecurity",
  "cloud-solutions": "Cloud Solutions",
  "business-automation": "Automation",
  "brand-identity": "Branding",
  "it-consulting": "Business IT Solutions",
};

/** The six services under the redesign's card names; descriptions stay canonical. */
export const serviceCards: readonly Service[] = services.map((s) => ({
  ...s,
  name: serviceCardNames[s.id],
}));

export const servicesShowcase = {
  eyebrow: "Services",
  title: "What we",
  accent: "do",
  note: "Scroll to bring them into line",
} as const;

export type WorkProject = {
  id: string;
  name: string;
  /*
   * Optional verified details. Leave undefined until supplied by GramByte;
   * cards show a "Details coming soon" placeholder instead.
   */
  category?: string;
  summary?: string;
  url?: string;
  image?: ProjectImage;
};

export const workSection = {
  eyebrow: "Selected Work",
  title: "Projects we’ve",
  accent: "built",
  pendingLabel: "Details coming soon",
  projects: [
    { id: "grambyte-green", name: "GramByte Green" },
    { id: "crown-and-root", name: "Crown & Root" },
    { id: "nursepro-canada", name: "NursePro Canada Inc." },
    { id: "lagos-ca", name: "Lagos.ca" },
    { id: "tiana-lux-hair", name: "Tiana Lux Hair" },
    { id: "gibbs-africa-peace-corps", name: "Gibbs Africa Peace Corps" },
  ] as readonly WorkProject[],
} as const;

export const storySection = {
  eyebrow: "Our Story",
  title: "How we",
  accent: "got here",
  milestones: [
    { id: "founded", date: "January 2026", title: "GramByte founded" },
    { id: "incorporated", date: "May 2026", title: "GramByte Technologies Inc. incorporated" },
    { id: "first-clients", date: "2026", title: "First client projects" },
    { id: "toronto-workspace", date: "2026", title: "Toronto workspace established" },
    { id: "next-chapter", date: "Now", title: "Building the next chapter" },
  ],
} as const;

export const stackSection = {
  eyebrow: "Technology Stack",
  title: "Tools we",
  accent: "work with",
  note: "Drag the tags around",
  shuffleLabel: "Shuffle",
  tags: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Azure",
    "PostgreSQL",
    "MySQL",
    "GSAP",
    "Figma",
    "AI",
    "Cybersecurity",
    "Automation",
  ],
} as const;

export const statsSection = {
  eyebrow: "By the numbers",
  title: "GramByte in",
  accent: "numbers",
} as const;

export const stats: readonly { id: string; value: number; suffix?: string; label: string }[] = [
  { id: "services", value: 6, label: "Core Services" },
  { id: "markets", value: 3, label: "Markets" },
  { id: "projects", value: 6, suffix: "+", label: "Portfolio Projects" },
];

export const contactShowcase = {
  eyebrow: "Contact",
  headline: ["Let’s build", "something", "useful."],
  intro: contact.intro,
  /** Scrolls to the contact form (CONTACT_SECTION_ID in lib/contact/prefill.ts). */
  cta: { label: "Start a Project", href: "#contacts" },
  email: contact.email,
  emailLabel: "Email us",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  locations: aboutSection.locations.map((l) => l.name).join(" · "),
} as const;
