import Image from "next/image";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import OriginMap from "@/components/OriginMap";
import {
  Arrow,
  Button,
  ButtonRow,
  Container,
  CTABand,
  Eyebrow,
  Figure,
  LeafMark,
  Section,
  SectionHeading,
  SpecList,
  StatRow,
  TextLink,
} from "@/components/ui";
import { images, BLUR } from "@/lib/images";
import { teas } from "@/lib/teas";
import { STAGES } from "@/lib/journey";
import { exportFacts, pillars, site } from "@/lib/site";

/**
 * HOMEPAGE
 * ----------------------------------------------------------------------------
 * Ordered to answer an international buyer's questions in the order they ask
 * them: who are you → what do you sell → where does it come from → how is it
 * made → why should I trust you → how do I start.
 *
 * The tea-finder quiz that used to sit here has moved to its own page and is
 * linked from the collection. A four-step interactive quiz mid-scroll stalled
 * the narrative and duplicated /tea-finder wholesale.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Positioning />
      <Collection />
      <Origins />
      <Craft />
      <Trade />
      <CTABand
        title="Start with a sample, not a commitment."
        lead={`Tell us the teas, the volume and the market. We will send samples and quote against what you actually need — or write to ${site.email}.`}
        primary={{ href: "/request?type=sample", label: "Request samples" }}
        secondary={{ href: "/wholesale", label: "Export terms" }}
      />
    </>
  );
}

/* ============================================================================
   1 · HERO
   ----------------------------------------------------------------------------
   84svh rather than a full screen: enough to feel like an arrival, short enough
   that the first section is visibly beginning at the fold, which is what stops
   a hero reading as a splash page.
   ========================================================================== */

function Hero() {
  return (
    <section className="relative flex min-h-[84svh] items-end overflow-hidden bg-leaf-900">
      <div className="absolute inset-0">
        <Image
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="animate-drift object-cover"
        />
        {/* Two scrims only — the old build stacked three, which flattened the
            photograph into a green wash before the copy needed it. The copy
            block is proportionally taller on a phone, so the lower scrim
            carries further up there and eases off on wide screens. */}
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/92 via-leaf-900/55 to-leaf-900/15 sm:via-leaf-900/35" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-leaf-900/50 to-transparent" />
      </div>

      <Container size="wide" className="relative z-10 pb-16 pt-32 sm:pb-20">
        <div className="max-w-3xl text-paper">
          <Reveal>
            <Eyebrow className="text-brass-300">Indian tea, exported worldwide</Eyebrow>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="t-display mt-5">
              Fine Indian tea,
              <br />
              <span className="italic">shipped by the lot.</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="t-lead mt-6 max-w-lg text-paper/75">
              Black, green, white and oolong tea, masala chai and blends made to a
              brief — sourced from India&rsquo;s established growing regions and
              supplied to importers, blenders, retailers and cafés abroad.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <ButtonRow className="mt-9">
              <Button href="/request?type=sample" variant="primary" onDark>
                Request samples
                <Arrow />
              </Button>
              <Button href="/teas" variant="secondary" onDark>
                View the collection
              </Button>
            </ButtonRow>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================================
   2 · POSITIONING — who we are
   ========================================================================== */

function Positioning() {
  return (
    <Section tone="paper" size="lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Eyebrow className="text-brass-600">Who we are</Eyebrow>
              <h2 className="t-h2 mt-4">Tea with a touch of class.</h2>
              <p className="t-body mt-5 max-w-md text-ink-soft">
                {site.positioning} We work between the gardens of India and buyers
                abroad — the people who need leaf they can rely on, lot after lot,
                and paperwork that clears without a phone call.
              </p>
              <TextLink href="/about" className="mt-7">
                More about Tejbidya
              </TextLink>
            </div>
          </Reveal>

          <div>
            {pillars.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <article className="group flex gap-5 border-t border-line py-7 first:border-t-0 first:pt-0">
                  <LeafMark className="mt-1 h-4 w-4 shrink-0 text-brass-600 transition-transform duration-500 group-hover:rotate-[10deg]" />
                  <div>
                    <span className="t-eyebrow text-ink-mute">{p.label}</span>
                    <h3 className="t-h3 mt-2.5">{p.title}</h3>
                    <p className="t-body mt-2 max-w-lg text-ink-soft">{p.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ============================================================================
   3 · COLLECTION — what we sell
   ========================================================================== */

function Collection() {
  return (
    <Section tone="soft" id="collection" size="lg">
      <Container size="wide">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="The collection"
              title="Six teas, one standard."
              lead="A range built to cover a Western buyer's shelf from one supplier — from the everyday black tea that carries a blend to the delicate lots a speciality line is built on."
            />
            <TextLink href="/teas" className="pb-1.5">
              All teas
            </TextLink>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teas.map((tea, i) => (
            <Reveal key={tea.slug} delay={(i % 3) * 80} className="h-full">
              <ProductCard tea={tea} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xs border border-line bg-paper px-6 py-5">
            <p className="t-small text-ink-soft">
              Not sure which leaf suits your market? Four questions and we will
              point you at the right one.
            </p>
            <TextLink href="/tea-finder">Open the tea finder</TextLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ============================================================================
   4 · ORIGINS — where it comes from
   ========================================================================== */

function Origins() {
  return (
    <Section tone="paper" id="origins" size="lg">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Where tea grows"
            title="India, region by region."
            lead="Altitude, soil and weather do more to shape a cup than anything that happens afterwards. India is unusual in having every one of those conditions inside one country."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12">
            <OriginMap />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ============================================================================
   5 · CRAFT — how it is made
   ----------------------------------------------------------------------------
   A static summary of the six stages, reading from lib/journey.ts. The full
   interactive walkthrough lives on /journey; putting it here as well meant two
   client components and eleven photographs on the homepage.
   ========================================================================== */

function Craft() {
  return (
    <Section tone="dark" size="lg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                dark
                eyebrow="Garden to cup"
                title="Flavour is made, not found."
                lead="A green leaf picked in the morning has almost none of the flavour you will eventually taste. It is built in the hours afterwards, by people making judgement calls."
              />
              <Figure
                image={images.factoryLeaf}
                ratio="landscape"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="mt-8"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ol>
              {STAGES.map((s) => (
                <li
                  key={s.key}
                  className="flex gap-5 border-b border-white/12 py-5 first:border-t first:border-white/12"
                >
                  <span className="t-meta mt-1 w-6 shrink-0 text-brass-300/70">{s.n}</span>
                  <div>
                    <h3 className="t-h4 text-paper">{s.title}</h3>
                    <p className="t-small mt-1 text-paper/55">{s.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
            <TextLink href="/journey" dark className="mt-7">
              Walk through the process
            </TextLink>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ============================================================================
   6 · TRADE — why trust us, and on what terms
   ========================================================================== */

const TRADE_STATS = [
  { value: "50 kg", label: "MOQ from" },
  { value: "7–21 days", label: "Typical delivery" },
  { value: "6", label: "Tea categories" },
  { value: "Worldwide", label: "Export destinations" },
] as const;

function Trade() {
  const terms = [
    { label: "Quality control", value: exportFacts.qc },
    { label: "Samples", value: exportFacts.samples },
    { label: "Lead time", value: `${exportFacts.leadTime} — ${exportFacts.leadTimeNote}` },
    { label: "Tracking", value: exportFacts.tracking },
    { label: "Private label", value: exportFacts.privateLabel },
  ];

  return (
    <Section tone="soft" size="lg">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Buying from us"
            title="Nothing ships untasted."
            lead="Buying tea across an ocean is an act of trust. We would rather you cupped it first, on your own bench, against whatever you are buying now."
          />
        </Reveal>

        <Reveal delay={100}>
          <StatRow stats={TRADE_STATS} className="mt-12" />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <Reveal>
            <SpecList items={terms} />
          </Reveal>

          <Reveal delay={120}>
            <Figure
              image={images.cuppingTray}
              ratio="landscape"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <p className="t-small mt-4 text-ink-mute">
              Every figure above is published by Tejbidya. Certification details
              and named export markets are confirmed on enquiry rather than
              claimed here.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
