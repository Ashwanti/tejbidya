import type { Metadata } from "next";
import { Container, Section } from "@/components/ui";
import { addressOneLine, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tejbidya Enterprises handles personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

/**
 * A factual description of what THIS website actually does with data - which we
 * know, because we built it. It is deliberately not a full GDPR/CCPA policy:
 * that requires legal input and facts about Tejbidya's internal handling that we
 * do not have. The gaps are marked rather than filled with boilerplate.
 */
export default function PrivacyPage() {
  return (
    <Section tone="paper" size="lg" className="pt-[calc(var(--header-h)+3rem)]">
      <Container>
        <div className="mx-auto max-w-[760px]">
          <h1 className="t-h1">Privacy Policy</h1>

          <div className="mt-6 rounded-xs border-l-2 border-brass-500 bg-paper-soft px-5 py-4">
            <p className="t-small text-ink-soft">
              <strong className="font-medium text-ink">
                This is a working draft, not legal advice.
              </strong>{" "}
              It describes what the website itself does with the information you
              enter. A complete policy — covering retention periods, third-party
              processors, and your rights under GDPR, UK GDPR and CCPA — needs
              review by a qualified adviser before launch.{" "}
             
            </p>
          </div>

          <div className="t-body mt-10 space-y-8 text-ink-soft">
            <section>
              <h2 className="t-h3 text-ink">
                What this site collects
              </h2>
              <p className="mt-4">
                The only personal information this website collects is what you
                type into the sample and quote request form: your name, company,
                email address, phone number, country, business type, and whatever
                you write in the message field, together with the teas, volume
                and packaging you select.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Why we collect it
              </h2>
              <p className="mt-4">
                To respond to your enquiry. That is the only stated purpose, and
                the form asks you to confirm it before sending.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Cookies and tracking
              </h2>
              <p className="mt-4">
                This website sets no cookies, runs no analytics, and embeds no
                advertising or social tracking scripts. Photography is served
                from a third-party image CDN, which will see your IP address as
                part of delivering those images — as any image host does.
              </p>
              <p className="mt-4">
                If analytics are added later, this section and a cookie notice
                must be updated. No analytics are in use at present.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Who else sees it
              </h2>
              <p className="mt-4">
                Enquiries are delivered to Tejbidya. Details of the hosting
                provider, email service and any CRM used to process enquiries,
                along with retention periods, are confirmed on request.
              </p>
            </section>

            <section>
              <h2 className="t-h3 text-ink">
                Your rights
              </h2>
              <p className="mt-4">
                You can ask what we hold about you, ask for it to be corrected,
                or ask for it to be deleted. Write to{" "}
                <a href={`mailto:${site.email}`} className="link-draw text-ink">
                  {site.email}
                </a>
                . The formal statutory wording for each jurisdiction is pending legal
                review.
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
