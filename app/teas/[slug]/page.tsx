import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import FlavorProfile, { StrengthMeter } from "@/components/FlavorProfile";
import ProductCard from "@/components/ProductCard";
import {
  Arrow,
  Badge,
  Button,
  ButtonRow,
  Container,
  CTABand,
  Eyebrow,
  Figure,
  Note,
  Section,
  SectionHeading,
  SpecList,
  StatRow,
  TextLink,
} from "@/components/ui";
import { ProductActions } from "@/components/ProductActions";
import { images } from "@/lib/images";
import { PACKAGING, getTea, teas } from "@/lib/teas";
import { exportFacts, site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return teas.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tea = getTea(slug);
  if (!tea) return {};

  return {
    title: `${tea.name} — Wholesale & Export`,
    description: `${tea.tagline} ${tea.intro.slice(0, 110)}… Bulk supply from India with samples on request.`,
    alternates: { canonical: `/teas/${tea.slug}` },
    openGraph: {
      title: `${tea.name} — Tejbidya`,
      description: tea.tagline,
      images: [{ url: tea.hero.src }],
    },
  };
}

export default async function TeaPage({ params }: Params) {
  const { slug } = await params;
  const tea = getTea(slug);
  if (!tea) notFound();

  const related = teas.filter((t) => t.slug !== tea.slug).slice(0, 3);

  /**
   * Product schema. Deliberately minimal: no `offers` block, because there are
   * no published prices; no `aggregateRating` or `review`, because inventing
   * either is both dishonest and a structured-data policy violation.
   */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tea.name,
    description: tea.intro,
    category: "Tea",
    brand: { "@type": "Brand", name: site.legalName },
    image: tea.hero.src,
  };

  const tradeStats = [
    { value: tea.moqKg ? `${tea.moqKg} kg` : "On request", label: "Minimum order" },
    { value: exportFacts.leadTime, label: "Typical delivery" },
    { value: "Included", label: "Shipment tracking" },
    { value: "Available", label: "Private label" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ================================================================ HERO
          Split rather than a photograph with text over it: the specification a
          buyer came for sits on paper, at full contrast, above the fold. */}
      <section className="bg-paper pt-[var(--header-h)]">
        <Container size="wide" className="py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-ink-mute">
              <li>
                <Link href="/teas" className="link-draw transition-colors hover:text-ink">
                  Teas
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-ink">{tea.name}</li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <Figure
                image={tea.hero}
                ratio="landscape"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="lg:aspect-[4/5]"
              />
            </Reveal>

            <Reveal delay={100}>
              <div className="flex h-full flex-col justify-center">
                <Eyebrow className="text-brass-600">{tea.category} tea</Eyebrow>
                <h1 className="t-h1 mt-4">{tea.name}</h1>
                <p className="t-lead mt-4 max-w-lg text-ink-soft">{tea.tagline}</p>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {tea.notes.slice(0, 4).map((n) => (
                    <Badge key={n} tone="outline">
                      {n}
                    </Badge>
                  ))}
                </div>

                <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6">
                  <div>
                    <dt className="t-meta text-ink-mute">Typical origin</dt>
                    <dd className="t-h4 mt-1.5">{tea.typicalOrigin.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt className="t-meta text-ink-mute">Minimum order</dt>
                    <dd className="t-h4 mt-1.5">
                      {tea.moqKg ? `${tea.moqKg} kg` : "On request"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <ProductActions tea={tea} />
                </div>

                <ButtonRow className="mt-5">
                  <Button href={`/request?type=sample&tea=${tea.slug}`} variant="secondary">
                    Request a sample
                    <Arrow />
                  </Button>
                  <Button href={`/request?type=quote&tea=${tea.slug}`} variant="quiet">
                    Request a quote
                  </Button>
                </ButtonRow>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================= THE TEA */}
      <Section tone="soft" size="lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <Reveal>
              <div>
                <Eyebrow className="text-brass-600">The tea</Eyebrow>
                <p className="mt-5 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-[1.45] text-ink">
                  {tea.intro}
                </p>

                <SpecList
                  className="mt-9"
                  items={[
                    { label: "In the cup", value: tea.cup },
                    { label: "Aroma", value: tea.aroma },
                    { label: "Flavour notes", value: tea.notes.join(", ") },
                  ]}
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="lg:sticky lg:top-28">
                <div className="rounded-xs border border-line bg-paper p-6 sm:p-7">
                  <FlavorProfile profile={tea.profile} teaName={tea.name} />
                  <div className="mt-6 border-t border-line pt-6">
                    <StrengthMeter value={tea.strength} label={tea.strengthLabel} />
                  </div>
                </div>

                <Figure
                  image={tea.still}
                  ratio="landscape"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="mt-5"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ============================================================ BREWING */}
      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Preparation"
                title="Brewed the way it is meant to be."
                lead={tea.brewing.tip}
              />
            </Reveal>

            <Reveal delay={100}>
              <div>
                <StatRow
                  size="sm"
                  stats={[
                    { value: tea.brewing.leaf, label: "Leaf per cup" },
                    { value: tea.brewing.water, label: "Water" },
                    { value: tea.brewing.time, label: "Steep" },
                    { value: tea.brewing.ratio, label: "Ratio" },
                  ]}
                />
                <p className="t-small mt-7 text-ink-mute">
                  General preparation guidance for this style of tea. Adjust to
                  your own water and taste.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ============================================================= ORIGIN */}
      <Section tone="soft" size="lg">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Figure
                image={images.hillsMisty}
                ratio="landscape"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>

            <Reveal delay={100}>
              <div>
                <SectionHeading
                  eyebrow="Origin"
                  title="Where this style grows."
                  lead={`In India, ${tea.name.toLowerCase()} of this character comes principally from ${tea.typicalOrigin.join(
                    ", "
                  )}. Each region puts its own stamp on the leaf.`}
                />

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {tea.typicalOrigin.map((o) => (
                    <Badge key={o} tone="outline">
                      {o}
                    </Badge>
                  ))}
                </div>

                {/* Explicit separation between "this is where the style grows"
                    and "this is where Tejbidya buys" — we only know the former. */}
                <Note className="mt-7 max-w-lg">
                  Regions listed are where this style of tea is typically grown in
                  India. The specific garden for a given lot is confirmed on
                  enquiry.
                </Note>

                <TextLink href="/origins" className="mt-7">
                  Explore the regions
                </TextLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ========================================= PACKAGING & EXPORT TERMS */}
      <Section tone="paper" size="lg">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Packaging & export"
              title="However you need it packed."
              lead={`${exportFacts.privateLabel}. Terms below are as published by Tejbidya.`}
            />
          </Reveal>

          <Reveal delay={80}>
            <StatRow stats={tradeStats} className="mt-10" />
          </Reveal>

          <div className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {PACKAGING.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 70}>
                <div className="border-t border-line pt-4">
                  <h3 className="t-h4">{p.name}</h3>
                  <p className="t-small mt-1.5 text-ink-soft">{p.detail}</p>
                  <p className="t-meta mt-3 text-ink-mute">{p.use}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ======================================================= RELATED TEAS */}
      <Section tone="soft" size="lg">
        <Container size="wide">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Also in the range" title="Continue through the collection." />
              <TextLink href="/teas" className="pb-1.5">
                All teas
              </TextLink>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t, i) => (
              <Reveal key={t.slug} delay={i * 80} className="h-full">
                <ProductCard tea={t} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTABand
        title={`Cup ${tea.name.toLowerCase()} before you commit.`}
        lead={`${exportFacts.samples}. Tell us the volume and format you have in mind and we will quote against it.`}
        primary={{ href: `/request?type=sample&tea=${tea.slug}`, label: "Request a sample" }}
        secondary={{ href: `/request?type=quote&tea=${tea.slug}`, label: "Request a quote" }}
      />
    </>
  );
}
