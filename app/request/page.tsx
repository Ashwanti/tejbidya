import type { Metadata } from "next";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { Container, Eyebrow, Section } from "@/components/ui";
import { images } from "@/lib/images";
import { addressOneLine, exportFacts, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Sample or Quote",
  description:
    "Request tea samples or a wholesale quote from Tejbidya. Tell us the teas, volume and packaging you need and we will come back to you directly.",
  alternates: { canonical: "/request" },
};

const STEPS = [
  {
    n: "01",
    t: "You tell us what you need",
    d: "Teas, rough volume, the format you want it packed in, and which market it is going to.",
  },
  {
    n: "02",
    t: "We send samples",
    d: `${exportFacts.samples}. Cup them on your own bench, against whatever you are buying now.`,
  },
  {
    n: "03",
    t: "We quote against the real thing",
    d: "Once you know which lot you want, pricing is quoted against your actual volume and packaging.",
  },
] as const;

export default function RequestPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Request a sample or quote"
        lead="The fastest way to judge a tea supplier is to taste what they send. Tell us what you are looking for."
        image={images.cuppingTray}
      />

      <Section tone="paper" size="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            {/* ---- Sidebar ---- */}
            <div>
              <Reveal>
                <Eyebrow className="text-brass-600">How it works</Eyebrow>
                <ol className="mt-6">
                  {STEPS.map((s) => (
                    <li
                      key={s.n}
                      className="flex gap-4 border-b border-line py-5 first:border-t first:border-line"
                    >
                      <span className="t-meta mt-1 w-6 shrink-0 text-brass-600">{s.n}</span>
                      <span>
                        <span className="t-h4 block">{s.t}</span>
                        <span className="t-small mt-1.5 block text-ink-soft">{s.d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={140}>
                <div className="mt-8">
                  <h2 className="t-meta text-ink-mute">Prefer to write directly?</h2>
                  <div className="mt-3 space-y-1 text-[0.95rem]">
                    <a href={`mailto:${site.email}`} className="link-draw block text-ink">
                      {site.email}
                    </a>
                    <a href={`tel:${site.phoneHref}`} className="link-draw block text-ink">
                      {site.phone}
                    </a>
                  </div>
                  <address className="t-small mt-4 not-italic text-ink-mute">
                    {addressOneLine}
                  </address>
                </div>
              </Reveal>
            </div>

            {/* ---- Form ---- */}
            <Reveal delay={100}>
              {/* InquiryForm reads ?type= and ?tea= from the URL, so it needs a
                  Suspense boundary to stay statically prerenderable. */}
              <Suspense
                fallback={
                  <div
                    className="min-h-[620px] animate-pulse rounded-xs border border-line bg-paper-soft"
                    aria-hidden
                  />
                }
              >
                <InquiryForm />
              </Suspense>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
