import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { Arrow, Container, CTABand, Section, SectionHeading, SpecList } from "@/components/ui";
import { images } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Tejbidya",
  description:
    "Contact Tejbidya Enterprises in Pune, Maharashtra for wholesale Indian tea enquiries, samples and export quotes.",
  alternates: { canonical: "/contact" },
};

const ROUTES = [
  {
    t: "Request samples",
    d: "Cup the tea before committing to anything.",
    href: "/request?type=sample",
  },
  {
    t: "Request a quote",
    d: "Pricing against your volume, format and destination.",
    href: "/request?type=quote",
  },
  {
    t: "Wholesale information",
    d: "MOQs, packaging, lead times and export terms.",
    href: "/wholesale",
  },
  {
    t: "Read the buyer FAQ",
    d: "The questions buyers ask most often, answered.",
    href: "/faq",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        lead="A sample, a quote, or a question about whether we can do what you need — the same people answer all three."
        image={images.glassSteam}
      />

      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            {/* ---- Details ---- */}
            <Reveal>
              <div>
                <SectionHeading eyebrow="Direct" title="Reach us here." />

                <SpecList
                  className="mt-8"
                  items={[
                    {
                      label: "Email",
                      value: (
                        <a href={`mailto:${site.email}`} className="link-draw t-h4 text-ink">
                          {site.email}
                        </a>
                      ),
                    },
                    {
                      label: "Phone",
                      value: (
                        <a href={`tel:${site.phoneHref}`} className="link-draw t-h4 text-ink">
                          {site.phone}
                        </a>
                      ),
                    },
                    {
                      label: "Address",
                      value: (
                        <address className="not-italic leading-[1.7]">
                          {site.address.line1}
                          <br />
                          {site.address.line2}
                          <br />
                          {site.address.city}, {site.address.region}
                          <br />
                          {site.address.country}
                        </address>
                      ),
                    },
                    {
                      label: "Time zone",
                      value: "India Standard Time (UTC+5:30). Say which hours suit you and we will work to them.",
                    },
                  ]}
                />
              </div>
            </Reveal>

            {/* ---- Routes ---- */}
            <Reveal delay={100}>
              <div>
                <h2 className="t-eyebrow text-brass-600">Or start here</h2>
                <div className="mt-6 overflow-hidden rounded-xs border border-line">
                  {ROUTES.map((r, i) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className={`group flex items-center justify-between gap-6 bg-paper p-5 transition-colors duration-300 hover:bg-paper-soft ${
                        i > 0 ? "border-t border-line" : ""
                      }`}
                    >
                      <span>
                        <span className="t-h4 block">{r.t}</span>
                        <span className="t-small mt-1 block text-ink-soft">{r.d}</span>
                      </span>
                      <Arrow className="shrink-0 text-ink-mute" />
                    </Link>
                  ))}
                </div>

                <p className="t-small mt-6 text-ink-mute">
                  The request form captures teas, volume, packaging and market in
                  one go, which usually saves a round of emails.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Send us the brief."
        lead="Teas, volume, packaging and destination — that is everything we need to quote."
        primary={{ href: "/request", label: "Open the request form" }}
        secondary={{ href: `mailto:${site.email}`, label: "Email us instead" }}
      />
    </>
  );
}
