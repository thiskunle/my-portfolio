import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { BackToTop } from "@/components/layout/BackToTop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { company, siteMetadata } from "@/lib/content";
import { themeColors, themeInitScript } from "@/lib/theme";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Poppins is not a variable font, so weights must be listed.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: siteMetadata.title,
    template: `%s — ${company.name}`,
  },
  description: siteMetadata.description,
  applicationName: company.name,
  authors: [{ name: company.founder.name }],
  creator: company.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: company.name,
    title: siteMetadata.title,
    description: siteMetadata.description,
    // Image: app/opengraph-image.tsx (file convention, attached automatically).
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      // The inline theme script may set data-theme before hydration.
      suppressHydrationWarning
      className={`${montserrat.variable} ${poppins.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col bg-paper font-body text-ink antialiased">
        {/* Target for the brand and back-to-top links. */}
        <div id="top" />
        <SkipLink />
        <MotionProvider>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <BackToTop />
        </MotionProvider>
      </body>
    </html>
  );
}
