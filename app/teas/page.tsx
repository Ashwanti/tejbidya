import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import {
  Container,
  CTABand,
  Section,
  SectionHeading,
  StatRow,
  TextLink,
} from "@/components/ui";
import { images } from "@/lib/images";
import { teas } from "@/lib/teas";

export const metadata: Metadata = {
  title: "The Collection — Indian Teas for Export",
  description:
    "Black, green, white and oolong tea, masala chai and flavoured blends. Wholesale supply from India, MOQ from 50 kg, with samples on request and custom packaging available.",
  alternates: { canonical: "/teas" },
};

const RANGE_STATS = [
  { value: "6", label: "Tea categories" },
  { value: "50 kg", label: "MOQ from" },
  { value: "7–21 days", label: "Typical delivery" },
  { value: "Available", label: "Private label" },
] as const;

export default function TeasPage() {
  return (
    <>
      <PageHero
        eyebrow="The collection"
        title="Six teas, one standard"
        lead="Enough range to cover a shelf from a single supplier — from the everyday black tea that carries a blend to the delicate lots a speciality line is built on."
        image={images.glassHeld}
      />

      <Section tone="paper" size="md">
        <Container size="wide">
          <Reveal>
            <StatRow stats={RANGE_STATS} />
          </Reveal>

          {/*
            One grid of one card component. The previous build listed the teas
            here as wide editorial rows and again as cards on the homepage — two
            layouts, two sets of facts, and an invented price on both.
          */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teas.map((tea, i) => (
              <Reveal key={tea.slug} delay={(i % 3) * 80} className="h-full">
                <ProductCard tea={tea} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="soft" size="sm">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <SectionHeading
                eyebrow="Tea finder"
                title="Let us narrow it down."
                lead="Four questions about how the tea will be drunk and what it is for, and we will point you at the leaf in our range that fits — with the reasoning shown."
              />
              <TextLink href="/tea-finder" className="shrink-0 pb-1.5">
                Start the tea finder
              </TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTABand
        title="Cup them before you commit."
        lead="Samples are available on any line in the range, sent before any bulk order."
        primary={{ href: "/request?type=sample", label: "Request samples" }}
        secondary={{ href: "/wholesale", label: "Export terms" }}
      />
    </>
  );
}
