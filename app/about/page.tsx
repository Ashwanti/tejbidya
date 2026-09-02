import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import {
  Container,
  CTABand,
  Eyebrow,
  Figure,
  LeafMark,
  Section,
  SectionHeading,
  StatRow,
  TextLink,
} from "@/components/ui";
import { images } from "@/lib/images";
import { pillars, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Tejbidya — Indian Tea Exporters",
  description:
    "Tejbidya Enterprises exports premium Indian teas to buyers worldwide from Pune, Maharashtra: premium quality, global reach and sustainable sourcing.",
  alternates: { canonical: "/about" },
};

/** How an enquiry actually proceeds. Nothing here is a claim we cannot keep. */
const HOW_WE_WORK = [
  {
    n: "01",
    t: "Tell us the brief",
    d: "Which teas, roughly what volume, the format you need it packed in and the market it is going to.",
  },
  {
    n: "02",
    t: "Cup the samples",
    d: "Samples go out before any bulk commitment, so you judge the leaf on your own bench against whatever you buy now.",
  },
  {
    n: "03",
    t: "Quote, pack, ship",
    d: "Pricing against your real volume and packaging, then export with documentation prepared and tracking on the order.",
  },
] as const;

const ABOUT_STATS = [
  { value: "Pune, India", label: "Based in" },
  { value: "Worldwide", label: "Exports to" },
  { value: "6", label: "Tea categories" },
  { value: "50 kg", label: "MOQ from" },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Tea with a touch of class"
        lead={site.positioning}
        image={images.hillsDeep}
      />

      {/* ---- What we do ---- */}
      <Section tone="soft" size="lg">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Figure
                image={images.leafInHands}
                ratio="portrait"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>

            <Reveal delay={100}>
              <div>
                <SectionHeading
                  eyebrow="What we do"
                  title="Between the garden and the buyer."
                />
                <div className="t-body mt-5 space-y-4 text-ink-soft">
                  <p>
                    Tejbidya Enterprises is a tea exporter based in Pune,
                    Maharashtra. We source premium Indian teas and ship them to
                    buyers around the world — importers, blenders, retailers and
                    cafés who need dependable leaf in commercial quantity.
                  </p>
                  <p>
                    The range covers the categories that matter to a Western buyer:
                    black, green, white and oolong tea, masala chai, and flavoured
                    blends that can be developed to a brief. Minimums start at
                    50&nbsp;kg, and every enquiry can begin with samples rather
                    than a commitment.
                  </p>
                  <p>
                    Custom packaging is available for buyers selling under their own
                    brand, and every batch is tested for flavour, aroma and
                    freshness before it is exported.
                  </p>
                </div>

                <TextLink href="/wholesale" className="mt-7">
                  Wholesale &amp; export terms
                </TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Three commitments ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we stand on"
              title="Three commitments."
              lead="Stated plainly, and the same three we are judged on by every buyer who reorders."
            />
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <div className="border-t border-line pt-5">
                  <LeafMark className="h-4 w-4 text-brass-600" />
                  <Eyebrow className="mt-4 block text-ink-mute" rule={false}>
                    {p.label}
                  </Eyebrow>
                  <h3 className="t-h3 mt-2.5">{p.title}</h3>
                  <p className="t-body mt-2 text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <StatRow stats={ABOUT_STATS} className="mt-14" />
          </Reveal>
        </Container>
      </Section>

      {/* ---- How we work ---- */}
      <Section tone="soft" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="Three steps, no obligation."
              lead="The first order carries all the risk for a buyer. This is how we take as much of it out as we can."
            />
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-3">
            {HOW_WE_WORK.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="border-t border-line pt-5">
                  <span className="t-meta text-brass-600">{s.n}</span>
                  <h3 className="t-h3 mt-3">{s.t}</h3>
                  <p className="t-body mt-2 text-ink-soft">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTABand
        title="Let's talk about what you need."
        lead="Samples first, questions welcome, no obligation either way."
        primary={{ href: "/request?type=sample", label: "Request samples" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
