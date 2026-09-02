import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import TeaFinder from "@/components/TeaFinder";
import { Container, CTABand, Section } from "@/components/ui";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Tea Finder — Find the Right Leaf",
  description:
    "Answer four questions about how your tea will be drunk and what it is for, and we will recommend the tea in our range that fits.",
  alternates: { canonical: "/tea-finder" },
};

export default function TeaFinderPage() {
  return (
    <>
      <PageHero
        eyebrow="Tea finder"
        title="Find the right leaf"
        lead="Four questions, no jargon, and a straight recommendation at the end with the reasoning shown."
        image={images.infuser}
      />

      <Section tone="paper" size="lg">
        <Container>
          <Reveal>
            <TeaFinder />
          </Reveal>

          <Reveal>
            <p className="t-small mx-auto mt-8 max-w-xl text-center text-ink-mute">
              The finder matches your answers against the character of each tea in
              our range. It is a starting point for a conversation, not a
              substitute for cupping the tea yourself — which is what samples are
              for.
            </p>
          </Reveal>
        </Container>
      </Section>

      <CTABand
        title="Now taste it."
        lead="Samples of your match, and anything else in the range worth comparing it against."
        primary={{ href: "/request?type=sample", label: "Request samples" }}
        secondary={{ href: "/teas", label: "View the collection" }}
      />
    </>
  );
}
