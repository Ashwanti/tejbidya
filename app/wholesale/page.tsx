import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import {
  Container,
  CTABand,
  Figure,
  LeafMark,
  Note,
  Section,
  SectionHeading,
  StatRow,
} from "@/components/ui";
import { images } from "@/lib/images";
import { PACKAGING, teas } from "@/lib/teas";
import { exportFacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wholesale & Export — Bulk Indian Tea Supply",
  description:
    "Wholesale Indian tea for importers, blenders, retailers and cafés. MOQ from 50 kg, custom packaging and private label, samples on request, 7–21 day delivery.",
  alternates: { canonical: "/wholesale" },
};

const SERVES = [
  {
    t: "Importers & distributors",
    d: "Container and part-container volumes, with consistent grades lot to lot.",
  },
  {
    t: "Blenders & repackers",
    d: "Base teas with the body and colour to hold a blend together.",
  },
  {
    t: "Retail & grocery",
    d: "Shelf-ready formats, or bulk to pack under your own label.",
  },
  {
    t: "Cafés & foodservice",
    d: "Volume chai and black tea built to be brewed fast and served with milk.",
  },
] as const;

/**
 * What a buyer can ask us for. This replaces the previous "what we cannot tell
 * you yet" list, which printed the project's internal content backlog into a
 * live page — honest, but it read to an importer as a supplier advertising its
 * own gaps. The claim here is narrower and still true: ask, and we send what we
 * hold. Nothing on this page asserts a certification we cannot evidence.
 */
const DUE_DILIGENCE = [
  { t: "Product specification", d: "Grade, leaf style, moisture and packing details for the lot you are quoted." },
  { t: "Certification", d: "Tell us what your market requires and we will confirm what we hold before you order." },
  { t: "Samples", d: "Sent before any bulk commitment, so the leaf is judged on your bench, not our word." },
  { t: "Export documentation", d: "Prepared for your port of entry as part of the shipment, not as an extra." },
] as const;

const TERMS_STATS = [
  { value: "50 kg", label: "MOQ — green & oolong" },
  { value: "100 kg", label: "MOQ — black & chai" },
  { value: "7–21 days", label: "Typical delivery" },
  { value: "Included", label: "Shipment tracking" },
] as const;

export default function WholesalePage() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale & export"
        title="Supply, not shopping"
        lead="Tejbidya sells tea by the lot to buyers abroad. Here is exactly how that works, and on what terms."
        image={images.valleyPour}
      />

      {/* ---- Published terms ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The terms"
              title="What is published, published."
              lead="Every figure below is stated by Tejbidya. Anything not confirmed is quoted on enquiry rather than estimated here."
            />
          </Reveal>

          <Reveal delay={100}>
            <StatRow stats={TERMS_STATS} className="mt-12" />
          </Reveal>

          {/* MOQ per tea */}
          <Reveal delay={140}>
            <div className="mt-14 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <caption className="sr-only">Minimum order quantity by tea</caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    {["Tea", "Category", "Minimum order", "Typical origin"].map((h) => (
                      <th key={h} scope="col" className="t-meta py-3 pr-6 text-ink-mute">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teas.map((t) => (
                    <tr key={t.slug} className="border-b border-line">
                      <th scope="row" className="t-h4 py-4 pr-6 text-ink">
                        {t.name}
                      </th>
                      <td className="py-4 pr-6 text-[0.9rem] text-ink-soft">{t.category}</td>
                      <td className="py-4 pr-6 text-[0.9rem] tabular-nums text-ink">
                        {t.moqKg ? `${t.moqKg} kg` : <span className="text-ink-mute">On request</span>}
                      </td>
                      <td className="py-4 pr-6 text-[0.85rem] text-ink-mute">
                        {t.typicalOrigin.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="t-small mt-4 text-ink-mute">
              MOQ for black tea, masala chai, green tea and oolong tea as published
              by Tejbidya. Other lines are quoted on enquiry.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ---- Who we supply ---- */}
      <Section tone="dark" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <SectionHeading
                  dark
                  eyebrow="Who we supply"
                  title="Four kinds of buyer."
                  lead="The requirement changes a great deal depending on which of these you are — so tell us, and the conversation gets shorter."
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                {SERVES.map((s) => (
                  <article
                    key={s.t}
                    className="group flex gap-5 border-b border-white/12 py-6 first:border-t first:border-white/12"
                  >
                    <LeafMark className="mt-1 h-4 w-4 shrink-0 text-brass-300/70 transition-transform duration-500 group-hover:rotate-[10deg]" />
                    <div>
                      <h3 className="t-h3 text-paper">{s.t}</h3>
                      <p className="t-body mt-1.5 text-paper/60">{s.d}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Packaging ---- */}
      <Section tone="soft" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <Reveal>
              <div>
                <SectionHeading
                  eyebrow="Packaging & private label"
                  title="Packed to suit the shelf it lands on."
                  lead={`${exportFacts.privateLabel}.`}
                />

                <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  {PACKAGING.map((p) => (
                    <div key={p.name} className="border-t border-line pt-4">
                      <h3 className="t-h4">{p.name}</h3>
                      <p className="t-small mt-1.5 text-ink-soft">{p.detail}</p>
                      <p className="t-meta mt-2.5 text-ink-mute">{p.use}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <Figure
                image={images.factoryHall}
                ratio="portrait"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="lg:sticky lg:top-28"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---- Due diligence ---- */}
      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Due diligence"
                title="Ask us for the paperwork."
                lead="Every serious buyer checks a supplier before the first container. We would rather you did — and rather send you the real documents than a page of logos."
              />
            </Reveal>

            <Reveal delay={100}>
              <div>
                {DUE_DILIGENCE.map((d) => (
                  <div key={d.t} className="border-b border-line py-4 first:border-t first:border-line">
                    <h3 className="t-h4">{d.t}</h3>
                    <p className="t-small mt-1.5 text-ink-soft">{d.d}</p>
                  </div>
                ))}
                <Note className="mt-7">
                  Certifications, named export markets and estate partners are
                  confirmed directly on enquiry rather than published here, so
                  that nothing on this site outruns what can be evidenced.
                </Note>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTABand
        title="Start with a sample."
        lead="Tell us the teas, the volume and the destination, and we will quote against exactly that."
        primary={{ href: "/request?type=quote", label: "Request a quote" }}
        secondary={{ href: "/request?type=sample", label: "Request samples" }}
      />
    </>
  );
}
