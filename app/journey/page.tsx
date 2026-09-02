import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import TeaJourney from "@/components/TeaJourney";
import {
  Container,
  CTABand,
  Note,
  Section,
  SectionHeading,
  SpecList,
} from "@/components/ui";
import { images } from "@/lib/images";
import { exportFacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Tea Is Made — Garden to Cup",
  description:
    "How tea is made, stage by stage: the garden, the harvest, withering and oxidation, grading and cupping, packing, and export to the buyer.",
  alternates: { canonical: "/journey" },
};

/** The four categories, separated by the one variable that creates them. */
const OXIDATION = [
  { t: "White", ox: "Barely any", d: "Withered and dried, almost nothing else. The leaf as it is." },
  { t: "Green", ox: "None", d: "Heated early to stop oxidation dead. Stays green and fresh." },
  { t: "Oolong", ox: "Partial", d: "Stopped in the middle. The widest range of any category." },
  { t: "Black", ox: "Full", d: "Taken all the way. Dark, strong, the base of most blends." },
] as const;

export default function JourneyPage() {
  return (
    <>
      <PageHero
        eyebrow="Garden to cup"
        title="How tea is made"
        lead="From a bush on a hillside to a cup on a counter — and the six stages in between that decide how it will taste."
        image={images.pluckerField}
      />

      {/* ---- Intro ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading eyebrow="Why it matters" title="Flavour is made, not found." />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="t-body max-w-xl space-y-5 text-ink-soft">
                <p>
                  A green leaf picked in the morning has almost none of the flavour
                  you will eventually taste. That flavour is built in the hours and
                  days afterwards, by people making judgement calls — how long to
                  wither, when to stop oxidation, how hot to fire.
                </p>
                <p>
                  Understanding those decisions is what separates a buyer who can
                  specify what they want from one who can only hope. This is the
                  process, plainly described.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- The six stages ---- */}
      <Section tone="soft" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Six stages"
              title="Follow the leaf."
              lead="Move through each stage to see what happens and why it changes the cup."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <TeaJourney />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Oxidation explainer ---- */}
      <Section tone="dark" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              dark
              align="center"
              eyebrow="The single biggest variable"
              title="Oxidation decides everything."
              lead="It is the same leaf every time. How far you let it oxidise is what names the tea."
            />
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {OXIDATION.map((s) => (
                <div key={s.t} className="border-t border-white/15 pt-4">
                  <div className="t-meta text-brass-300/80">{s.ox} oxidation</div>
                  <h3 className="mt-3 font-display text-[1.75rem] leading-none text-paper">
                    {s.t}
                  </h3>
                  <p className="t-small mt-3 text-paper/55">{s.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- What Tejbidya commits to ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="After processing"
                title="What Tejbidya commits to."
                lead="These are the undertakings Tejbidya states publicly, reproduced as given and without embellishment."
              />
            </Reveal>

            <Reveal delay={100}>
              <div>
                <SpecList
                  items={[
                    { label: "Quality control", value: exportFacts.qc },
                    { label: "Samples", value: exportFacts.samples },
                    { label: "Custom packaging", value: exportFacts.privateLabel },
                    {
                      label: "Delivery",
                      value: `${exportFacts.leadTime} ${exportFacts.leadTimeNote}`,
                    },
                    { label: "Tracking", value: exportFacts.tracking },
                  ]}
                />
                <Note className="mt-7">
                  Photographs on this page illustrate tea production generally.
                  Imagery of Tejbidya&rsquo;s own gardens and processing partners
                  is to follow.
                </Note>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        title="See what the process produces."
        lead="Samples of any line in the range, sent before a bulk order."
        primary={{ href: "/request?type=sample", label: "Request samples" }}
        secondary={{ href: "/teas", label: "View the collection" }}
      />
    </>
  );
}
