import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import LanguageSelector from "@/components/LanguageSelector";
import { addressOneLine, site } from "@/lib/site";
import { translateBootstrapScript } from "@/lib/translate";
import "./globals.css";

/**
 * TYPE PAIRING
 * ----------------------------------------------------------------------------
 * Newsreader — a warm, low-contrast editorial serif with real optical sizing.
 * Set at 400 (not the hairline 300 the previous build used, which disappeared
 * at body sizes and looked brittle at display sizes). Its italic carries the one
 * moment of flourish on the homepage.
 *
 * Instrument Sans — a quiet modern grotesk for everything functional. Two
 * weights only: 400 for copy, 500 for labels and buttons. Nothing heavier is
 * needed and nothing heavier is loaded.
 *
 * Both are self-hosted by next/font at build time — no render-blocking request
 * to Google, no layout shift, and only the two weights actually used ship.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Tejbidya — Premium Indian Tea, Exported Worldwide",
    template: "%s — Tejbidya",
  },
  description:
    "Premium Indian tea for international buyers. Black, green, white and oolong tea, masala chai and custom blends — supplied in bulk from India, with samples before any commitment.",
  keywords: [
    "Indian tea exporter",
    "wholesale tea supplier",
    "bulk tea India",
    "Assam tea export",
    "Darjeeling tea wholesale",
    "private label tea",
    "loose leaf tea supplier",
    "masala chai export",
  ],
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: "Tejbidya — Premium Indian Tea, Exported Worldwide",
    description:
      "Premium Indian tea for international buyers, supplied in bulk with samples before any commitment.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tejbidya — Premium Indian Tea, Exported Worldwide",
    description: "Premium Indian tea for international buyers, supplied in bulk from India.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F1",
  width: "device-width",
  initialScale: 1,
};

/**
 * Organization schema. Only fields we can actually verify are emitted — there is
 * deliberately no `foundingDate`, `award`, `hasCredential` or `aggregateRating`,
 * because inventing those is both dishonest and a structured-data violation.
 */
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  description: site.positioning,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: "412207",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: site.email,
    telephone: site.phone,
    availableLanguage: ["English"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${instrument.variable} no-js`}
    >
      <head>
        {/*
          Runs before first paint: if a previous visit saved a non-English
          choice, cover the page so it never flashes English before Google
          swaps it. Loading the widget is left to lib/translate.ts.
        */}
        <script dangerouslySetInnerHTML={{ __html: translateBootstrapScript }} />
        {/*
          Drop .no-js as early as possible. Scroll-reveal hides elements in CSS;
          if JS were unavailable that would leave the page blank, so the hiding
          only applies once we know JS is running.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
        <link rel="preconnect" href="https://images.pexels.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="bg-paper text-ink antialiased" suppressHydrationWarning>
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-xs focus:bg-leaf-900 focus:px-5 focus:py-3 focus:text-paper"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <LanguageSelector />
          {/* Google Translate's hidden container is created in JS (lib/translate.ts),
              never rendered here: Google rewrites that node on init, and a
              React-owned node being rewritten is what broke hydration. */}
          {/* Machine-readable NAP for local/business search, not shown visually. */}
          <span className="sr-only">{addressOneLine}</span>
        </CartProvider>
      </body>
    </html>
  );
}
