import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { addressOneLine, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of the Tejbidya Enterprises website and the information published on it.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

/**
 * Website terms only. Terms of SALE - payment, Incoterms, title and risk,
 * inspection, claims, force majeure, governing law - are a separate document
 * and require both legal input and Tejbidya's commercial policy, neither of
 * which we have. That gap is stated plainly rather than filled with boilerplate.
 */
export default function TermsPage() {
  return (
    <Section tone="paper" size="lg" className="pt-[calc(var(--header-h)+3rem)]">
      <Container>
        <div className="mx-auto max-w-[760px]">
          <h1 className="t-h1">Terms of Use</h1>

          <div className="mt-6 rounded-xs border-l-2 border-brass-500 bg-paper-soft px-5 py-4">
            <p className="t-small text-ink-soft">
              <strong className="font-medium text-ink">
                This is a working draft, not legal advice.
              </strong>{" "}
              It covers use of the website only. Terms of sale — payment,
              Incoterms, title and risk, inspection and claims, governing law —
              are a separate document that must be drafted with a qualified
              adviser.
            </p>
          </div>

          <div className="t-body mt-10 space-y-8 text-ink-soft">
            <section>
              <h2 className="t-h3 text-ink">
                About this website
              </h2>
              <p className="mt-4">
                This website is operated by {site.legalName}. By using it you
                accept these terms.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Information is indicative
              </h2>
              <p className="mt-4">
                Descriptions of teas on this site — including flavour profiles,
                aroma, strength and brewing guidance — describe the character
                typical of each style of tea. They are not measured
                specifications for any particular lot. Confirmed specifications
                are provided with samples and on quotation.
              </p>
              <p className="mt-4">
                Photographs illustrate tea growing, production and presentation
                generally, and do not depict specific estates or facilities
                unless expressly stated.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Enquiries are not orders
              </h2>
              <p className="mt-4">
                Submitting a sample or quote request through this website does
                not create a contract. Minimum order quantities and delivery
                times shown are those published by Tejbidya and may vary by
                product, destination and season. Nothing on this site is an offer
                capable of acceptance.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Terms of sale
              </h2>
              <p className="mt-4">
                Payment terms, Incoterms, passing of title and risk, inspection
                and rejection, claims handling, limitation of liability and
                governing law are set out in a separate document supplied with any
                quotation.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Contact
              </h2>
              <p className="mt-4">
                {site.legalName}
                <br />
                {addressOneLine}
                <br />
                <a href={`mailto:${site.email}`} className="link-draw text-ink">
                  {site.email}
                </a>
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}
