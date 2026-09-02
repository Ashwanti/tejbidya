import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import { Container, CTABand, Section } from "@/components/ui";
import { images } from "@/lib/images";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buyer FAQ",
  description:
    "Minimum order quantities, quality control, shipping times, samples and custom packaging — the questions tea buyers ask Tejbidya most often.",
  alternates: { canonical: "/faq" },
};

/** FAQPage schema — every Q&A below is published by Tejbidya, so this is safe. */
const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        eyebrow="Buyer FAQ"
        title="Questions, answered"
        lead="The things buyers ask before the first order. If yours is not here, just ask."
        image={images.glassDark}
      />

      <Section tone="paper" size="lg">
        <Container size="narrow">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={(i % 3) * 70}>
              {/* Native <details> so answers are open to search engines and work
                  with no JavaScript at all. */}
              <details className="group border-b border-line first:border-t first:border-line">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h2 className="t-h3 text-ink">{f.q}</h2>
                  <span aria-hidden className="relative mt-2 block h-3 w-3 shrink-0">
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-mute" />
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink-mute transition-transform duration-400 ease-[var(--ease-soft)] group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="t-body max-w-2xl pb-6 text-ink-soft">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </Container>
      </Section>

      <CTABand
        title="Ask us directly."
        lead={`No question is too basic, and none of them commit you to anything. Write to ${site.email} or send the form.`}
        primary={{ href: "/request", label: "Send an enquiry" }}
        secondary={{ href: "/contact", label: "Contact details" }}
      />
    </>
  );
}
