/**
 * Verified GramByte content.
 *
 * Sources:
 *   - reference/current-website.html (copy, contact details, projects, roles)
 *   - .claude/skills/frontend-design/SKILL.md (canonical service descriptions, CTA labels)
 *
 * Do not add claims, clients, metrics or outcomes here without confirmation.
 * Pricing is intentionally absent until it has been verified.
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

export const siteMetadata = {
  title: `${company.name} — ${company.founder.name}`,
  description:
    "GramByte Technologies Inc. helps businesses grow through web development, cybersecurity, cloud solutions, automation, branding, and digital transformation.",
} as const;

/* ── Navigation ──────────────────────────────────────── */

export type NavItem = {
  label: string;
  /** In-page anchors keep the original site's ids so existing links still resolve. */
  href: `#${string}`;
};

export const navigation: readonly NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "What We Do", href: "#features" },
  { label: "Recent Projects", href: "#portfolio" },
  // The pricing section is built once pricing has been verified.
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contacts" },
];

/* ── Hero ────────────────────────────────────────────── */

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
  /** Services shown as floating indicators around the founder portrait. */
  featuredServiceIds: [
    "web-development",
    "cybersecurity",
    "cloud-solutions",
  ] as const satisfies readonly ServiceId[],
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
  title: "What we do",
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
  },
];

export const projectsSection = {
  title: "Recent projects",
  projectCta: "Start a similar project",
} as const;

/* ── Contact ─────────────────────────────────────────── */

export const contact = {
  title: "Contact me",
  email: "info@grambyte.ca",
  phone: {
    display: "416-828-6764",
    href: "tel:+14168286764",
  },
  intro:
    "Contact GramByte Technologies Inc. for websites, cybersecurity support and awareness training, cloud setup, branding, and business technology services.",
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
