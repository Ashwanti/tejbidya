import Link from "next/link";
import { site } from "@/lib/site";
import { teas } from "@/lib/teas";
import { Container, LeafMark } from "./ui";

/**
 * FOOTER
 * ----------------------------------------------------------------------------
 * The one dark surface on the site besides the closing CTA band — it gives the
 * page a floor and lets the ivory above it read as deliberate rather than plain.
 *
 * The closing call to action that used to live here has moved into the shared
 * <CTABand>, so a page ends with one clear next step instead of two competing
 * ones stacked on top of each other.
 */

const COLUMNS = [
  {
    title: "Teas",
    links: teas.map((t) => ({ href: `/teas/${t.slug}`, label: t.name })),
  },
  {
    title: "Explore",
    links: [
      { href: "/origins", label: "Growing regions" },
      { href: "/journey", label: "How tea is made" },
      { href: "/tea-finder", label: "Tea finder" },
      { href: "/about", label: "About Tejbidya" },
    ],
  },
  {
    title: "Trade",
    links: [
      { href: "/wholesale", label: "Wholesale & export" },
      { href: "/request?type=sample", label: "Request samples" },
      { href: "/request?type=quote", label: "Request a quote" },
      { href: "/faq", label: "Buyer FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-leaf-900 text-paper">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-12">
          {/* ---- Brand ---- */}
          <div>
            <div className="flex items-baseline gap-2.5">
              <LeafMark className="h-[18px] w-[18px] -translate-y-px opacity-60" />
              <span className="font-display text-[1.45rem] leading-none">Tejbidya</span>
            </div>

            <p className="t-small mt-4 max-w-xs text-paper/55">{site.positioning}</p>

            <address className="mt-6 space-y-0.5 text-[0.85rem] not-italic leading-relaxed text-paper/55">
              <div>{site.address.line1}</div>
              <div>{site.address.line2}</div>
              <div>
                {site.address.city}, {site.address.region}, {site.address.country}
              </div>
            </address>

            <div className="mt-4 space-y-1 text-[0.875rem]">
              <a href={`mailto:${site.email}`} className="link-draw block text-paper/80">
                {site.email}
              </a>
              <a href={`tel:${site.phoneHref}`} className="link-draw block text-paper/80">
                {site.phone}
              </a>
            </div>
          </div>

          {/* ---- Link columns ---- */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="t-eyebrow text-brass-300/85">{col.title}</h2>
              <ul className="mt-5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-draw text-[0.875rem] text-paper/60 transition-colors duration-300 hover:text-paper"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      {/* ---- Compliance strip ---- */}
      <Container className="border-t border-white/10 py-6">
        <div className="flex flex-col gap-3 text-[0.8rem] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {year} {site.legalName}. All rights reserved.
          </span>
          <span className="flex items-center gap-4">
            <Link href="/privacy" className="link-draw transition-colors hover:text-paper/75">
              Privacy
            </Link>
            <Link href="/terms" className="link-draw transition-colors hover:text-paper/75">
              Terms
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
