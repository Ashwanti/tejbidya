import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import OriginMap from "@/components/OriginMap";
import HarvestChart from "@/components/HarvestTimeline";
import {
  Container,
  CTABand,
  Note,
  Section,
  SectionHeading,
} from "@/components/ui";
import { images } from "@/lib/images";
import { regions } from "@/lib/regions";

export const metadata: Metadata = {
  title: "Tea Regions of India — Origins",
  description:
    "Darjeeling, Assam, the Nilgiris, Munnar, Sikkim, Kangra and the Dooars: how altitude, soil and weather shape the character of Indian tea.",
  alternates: { canonical: "/origins" },
};

export default function OriginsPage() {
  return (
    <>
      <PageHero
        eyebrow="Origins"
        title="Where Indian tea comes from"
        lead="One plant, grown from the Himalayan foothills to the hills of the far south — and utterly different at each end."
        image={images.hillsSoft}
      />

      {/* ---- Why terroir matters ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading eyebrow="Terroir" title="The same plant, a different cup." />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="t-body max-w-xl space-y-5 text-ink-soft">
                <p>
                  Every tea in the world — black, green, white, oolong — comes from
                  a single species,{" "}
                  <em className="font-display text-[1.12em] not-italic text-ink">
                    <span className="italic">Camellia sinensis</span>
                  </em>
                  . What makes a Darjeeling taste nothing like an Assam is not the
                  plant. It is where that plant is standing.
                </p>
                <p>
                  Altitude is the biggest lever. High up, cold nights slow the bush
                  down; it grows less leaf, and what it does grow is denser in the
                  aromatic compounds that survive into the cup. That is why hill
                  teas are perfumed and light while plains teas are strong and
                  malty — the plains bush simply grows faster.
                </p>
                <p>
                  Rainfall, soil, shade and the timing of the flush do the rest.
                  India is unusual in having all of those conditions at once, inside
                  one country, which is why a single Indian supplier can cover a
                  range that would otherwise take three.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Interactive map ---- */}
      <Section tone="soft" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The map"
              title="Seven growing regions."
              lead="Select a region to see its altitude, terrain, harvest calendar and the character it is known for."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <OriginMap />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Harvest calendar ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The year"
              title="When each region picks."
              lead="Indian tea is not available uniformly across the year. A Darjeeling second flush and a Nilgiri frost harvest are six months apart — which is what decides when an order can actually ship."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12">
              <HarvestChart />
            </div>
          </Reveal>

          <Reveal>
            <Note className="mt-10 max-w-2xl">
              Harvest windows are typical for each region and shift year to year
              with weather. Confirmed picking dates and lot availability come
              with a quotation.
            </Note>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Comparison table ---- */}
      <Section tone="soft" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="At a glance"
              title="Side by side."
              lead="The same information as the map, in a form you can scan or hand to a colleague."
            />
          </Reveal>

          <Reveal delay={100}>
            {/* Scrolls inside its own container so the page body never scrolls
                horizontally on a phone. */}
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">
                  Comparison of India&rsquo;s tea-growing regions by altitude,
                  character and harvest
                </caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    {["Region", "State", "Altitude", "Character", "Produces"].map((h) => (
                      <th key={h} scope="col" className="t-meta py-3 pr-6 text-ink-mute">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-line transition-colors duration-200 hover:bg-paper-soft"
                    >
                      <th scope="row" className="t-h4 py-4 pr-6 text-ink">
                        {r.name}
                      </th>
                      <td className="py-4 pr-6 text-[0.9rem] text-ink-soft">{r.state}</td>
                      <td className="py-4 pr-6 text-[0.9rem] tabular-nums text-ink-soft">
                        {r.altitude}
                      </td>
                      <td className="py-4 pr-6 text-[0.9rem] text-ink-soft">{r.character}</td>
                      <td className="py-4 pr-6 text-[0.85rem] text-ink-mute">
                        {r.teas.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal>
            <Note className="mt-10 max-w-2xl">
              This page describes where tea is grown in India generally, not
              Tejbidya&rsquo;s own supply chain. Sourcing regions and garden
              partners for a specific lot are confirmed on enquiry.
            </Note>
          </Reveal>
        </Container>
      </Section>

      <CTABand
        title="Taste the difference a region makes."
        lead="Samples from across the range, sent before any bulk commitment."
        primary={{ href: "/request?type=sample", label: "Request samples" }}
        secondary={{ href: "/teas", label: "View the collection" }}
      />
    </>
  );
}
