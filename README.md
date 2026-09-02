# Tejbidya — Premium Indian Tea, Exported Worldwide

A rebuild of [tejbidya.com](https://tejbidya.com) as a premium, export-focused
brand site aimed at buyers in the US, UK, Europe, Canada and Australia.

The central strategic change: **the old site behaved like a shop; this one
behaves like an exporter.** Every product on tejbidya.com is priced at $0.00 and
carries an MOQ in kilograms — Tejbidya sells 50–100 kg lots to trade buyers, not
packets to consumers. So the primary conversions here are **Request a Sample**
and **Request a Quote**, not "add to cart".

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
```

Requires Node 18+. No environment variables are needed to run it.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15.5.25 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS v4, design tokens in `app/globals.css` |
| Fonts | Cormorant Garamond (display) + Inter (UI), self-hosted via `next/font` |
| Images | Next/Image against the Pexels CDN — see *Swapping the photography* |
| Animation | CSS transitions driven by one IntersectionObserver per element |
| Dependencies | Zero runtime UI libraries. No animation library, no component kit. |

**Performance.** 103 kB of shared JS; every page 106–134 kB first load. 25 routes,
all statically prerendered except the enquiry API. No render-blocking font
request, no layout shift, no analytics or tracking scripts.

---

## Structure

```
app/
  page.tsx              Homepage — Discover → Explore → Trust → Taste → Request
  teas/                 Collection listing + premium product pages
  origins/              Interactive map of India's tea regions
  journey/              Garden → Cup, six interactive stages
  tea-finder/           Four-question recommendation quiz
  wholesale/            MOQs, packaging, private label, due diligence
  request/              Sample & quote enquiry form
  about/ contact/ faq/ privacy/ terms/
  api/inquiry/route.ts  Enquiry endpoint  ← INTEGRATION POINT
  globals.css           Design tokens + the type scale  ← START HERE
components/
  ui.tsx        The component system: Section, Container, SectionHeading,
                Button, ButtonRow, TextLink, Figure, Badge, StatRow,
                SpecList, Note, CTABand, LeafMark
  ProductCard   The one card used for a tea, everywhere it appears
  TeaFinder  TeaJourney  OriginMap  FlavorProfile  InquiryForm
  Header  Footer  PageHero  Reveal
lib/
  site.ts     Verified company facts
  teas.ts     Product data
  journey.ts  The six production stages (homepage + /journey read from this)
  regions.ts  Tea regions + the map projection
  images.ts   Every photograph on the site  ← SINGLE POINT OF CHANGE
scripts/
  audit.mjs   Functional + accessibility audit
  shots.mjs   Full-page desktop & mobile screenshots
```

---

## The design system

Everything visual is defined once, in `app/globals.css`, and consumed through
`components/ui.tsx`. Nothing in a page invents a colour, a heading size or a
section height.

**Colour.** Three warm paper grounds (`paper`, `paper-soft`, `paper-deep`),
three steps of warm charcoal ink (`ink`, `ink-soft`, `ink-mute`), two hairline
weights (`line`, `line-strong`), a muted tea green (`leaf-*`, whose `leaf-900`
is the single dark surface), an earthy `clay-*` accent, and `brass-*` reserved
for small marks — never a fill.

**Type.** Newsreader for display, Instrument Sans for everything functional; two
weights each. Every heading uses one of `.t-display`, `.t-h1`, `.t-h2`, `.t-h3`,
`.t-h4`; every label uses `.t-eyebrow` or `.t-meta`. There are no ad-hoc
`clamp()` values in page files.

**Rhythm.** `<Section tone size>` owns every background and every piece of
vertical spacing. Four tones, four sizes; that is the whole vocabulary.

**Images.** `<Figure>` owns the aspect ratios (`portrait` 4:5, `landscape` 3:2,
`wide` 16:9, `square`, `fill`), the 2px radius, the blur-up and the hover
scale. Only the two hero components render `next/image` directly.

**Motion.** CSS transitions and two keyframes. Reveals are one
`IntersectionObserver` per element that disconnects after firing. No animation
library is installed, and none is needed.

---

## What was invented: nothing

The brief was explicit that certifications, awards, reviews, customers, export
countries, company history and product specifications must not be fabricated.
They aren't. Everything factual on this site traces to Tejbidya's own published
pages (homepage, product pages, FAQ).

Gaps are simply absent rather than filled with plausible-sounding filler.
`/wholesale` turns that into a trust play — "Ask us for the paperwork" — because
a buyer doing diligence will ask anyway, and a straight answer survives a phone
call in a way an invented certificate number does not.

An earlier build printed dashed "placeholder — awaiting information" chips into
the live UI, including in the footer. That was honest but read to an importer as
a supplier advertising its own gaps, so the chips are gone and the honesty is
carried by ordinary editorial copy instead. See **Outstanding content** below for
what is still missing.

**Verified and used:** the product range; MOQ 100 kg for black tea and masala
chai, 50 kg for green and oolong; batch testing for flavour, aroma and freshness;
7–21 day delivery after order confirmation; tracking provided; samples on
request; custom packaging offered; the tagline; the Pune address, phone and
email; the three stated pillars.

**Deliberately left blank** (full list under **Outstanding content** below):

- Certifications (FSSAI, Tea Board registration, organic/ISO/HACCP) and numbers
- Year established, founder, company history
- Named export markets and countries served
- Testimonials, references, case studies
- Awards, memberships, trade bodies
- Named sourcing estates or gardens
- Verified cupping notes and lab specs per lot
- Capacity, warehouse and blending facility details
- Photography of the real product, packaging and team

Three further honesty guards worth knowing about:

1. **Flavour profiles are labelled indicative.** The body/briskness/astringency
   values are typical of each *style* of tea, not measurements of Tejbidya's
   lots. Every profile chart carries that disclosure. Replace with real cupping
   scores in `lib/teas.ts` when they exist.
2. **The origins map is educational.** It shows where tea grows in India
   generally. `/origins` says plainly that Tejbidya's own sourcing regions are
   unconfirmed. `lib/regions.ts` has a `sourced` flag per region to switch on
   once they are.
3. **Structured data omits what we can't verify.** No `offers`, no
   `aggregateRating`, no `review`, no `foundingDate` — inventing those is both
   dishonest and a Google structured-data violation.

---

## Swapping the photography

All imagery currently comes from the Pexels CDN (free for commercial use, no
attribution required) as a launch placeholder. **Every image on the site is
referenced from `lib/images.ts` and nowhere else**, so replacing it is one file:

```ts
// Before
hero: img(11669960, "Terraced tea hills with a pale track winding between the rows"),

// After — drop the file into /public/img/
hero: { src: "/img/hero.jpg", alt: "Tejbidya's Assam garden at first light" },
```

Then delete the `remotePatterns` entry in `next.config.ts` once no remote images
remain. No component changes. Alt text lives beside each image — update it too,
since the current text describes the stock photo and does not claim to depict a
Tejbidya estate.

**Check the alt text against the actual file.** Nine entries were removed and eight
alts corrected during the redesign because the CDN's photographs had drifted from
the descriptions originally written for them — one card captioned "a brass kettle
and small glasses of milky spiced tea" was in fact a street-stall portrait.
`npm run sheet` renders every entry in `lib/images.ts` as a labelled contact
sheet so image and description can be compared side by side.

Product photography follows one art direction: warm, still and close — brewed
liquor in glass or porcelain, or dry leaf on a plain ground. Landscape and
process photography is reserved for editorial sections. Frames with cold casts,
loud props, legible third-party branding or documentary street scenes do not
belong in the product grid; mixing those with still life is what makes a
stock-photo site read as a template.

---

## Wiring up the enquiry form

`app/api/inquiry/route.ts` validates and normalises every enquiry server-side,
then hands it to `deliver()`. Out of the box it logs to the server and returns
success, so the form works from the first deploy. Pick one:

- **Webhook / CRM / Zapier / Make** — set `INQUIRY_WEBHOOK_URL` and you are done.
- **Email** — add Resend/SendGrid/Postmark and send from `deliver()`.

Until then the browser also offers a pre-filled `mailto:` on both the success and
error states, so no enquiry is silently dropped.

---

## Accessibility & SEO

Audited and passing: one `<h1>` per page, alt text on every image, every form
control labelled, visible focus rings, skip link, `prefers-reduced-motion`
honoured throughout, no horizontal overflow at 390/768/1440 px, no console
errors. Scroll-reveal degrades safely — a `.no-js` class keeps content visible if
JavaScript never runs.

Per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards,
`sitemap.xml`, `robots.txt`, Organization / Product / FAQPage JSON-LD.

**Charts.** The flavour profiles are horizontal meters, not radar charts: five
named axes for one tea is "compare magnitude across categories", and a radar
would scale area quadratically while making an arbitrary axis order look
meaningful. They use a single hue with a lighter track from the same ramp, carry
a text value beside every bar, and offer a table view — nothing depends on
reading a bar length. Teas are never encoded by colour, since the six earth-tone
accents fail CVD separation against each other.

---

## QA tooling

```bash
npm run audit    # structure, a11y, overflow, Tea Finder + form flows
npm run shots    # full-page desktop and mobile screenshots
npm run sheet    # labelled contact sheet of every image in lib/images.ts
```

All three drive the locally installed Chrome. The first two expect a build on
`http://localhost:3000` (pass another base URL as an argument). They are
development tools and are not part of the production bundle.

---

## Before going live

1. Supply the outstanding content below.
2. Swap in real photography (`lib/images.ts`).
3. Connect the enquiry form to email or a CRM.
4. Have the privacy policy and terms reviewed by a qualified adviser — both are
   marked as drafts and the terms of *sale* still need drafting entirely.
5. Point `site.url` in `lib/site.ts` at the production domain if it changes, and
   add 301s from the old WooCommerce product URLs (e.g.
   `/product/black-tea-2/` → `/teas/black-tea`).

---

## Outstanding content

The site never asserts any of the following, because none of it could be
verified. `/wholesale` invites buyers to ask for them directly instead, which is
honest without advertising the gaps. Supply these and they can be published:

- Certifications (FSSAI, Tea Board of India registration, organic / ISO / HACCP)
  — numbers and issuing bodies
- Year established, and the founder / company history
- Named export markets and countries currently served
- Customer testimonials, references and case studies
- Awards, memberships and trade-body affiliations
- Named sourcing estates or gardens per product
- Verified cupping notes and lab specifications per tea
- Annual capacity, warehouse and blending facility details
- Photography of the actual product, packaging and team

This list is deliberately **not** exported from `lib/site.ts`. Keeping it in the
repo rather than one import away from a component is what stops unverified
content leaking into a render.
