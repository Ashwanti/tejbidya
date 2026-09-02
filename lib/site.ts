/**
 * SITE FACTS
 * ----------------------------------------------------------------------------
 * Everything in `site` is sourced from Tejbidya's existing public website
 * (tejbidya.com — homepage, product pages and FAQ). Nothing here is invented.
 *
 * Anything NOT verifiable from that source is simply absent. The UI never
 * asserts a certification, a founding date, a named export market or a
 * testimonial, because none of those can currently be evidenced — /wholesale
 * invites buyers to ask for them instead. The outstanding content list lives in
 * README.md rather than in this file, so nothing unverified can leak into a
 * render by being one import away.
 */

export const site = {
  name: "Tejbidya",
  legalName: "Tejbidya Enterprises",
  /** Verbatim from the current tejbidya.com homepage. */
  tagline: "Tea with a touch of class — uncompromising quality, one sip at a time.",
  /** Verbatim positioning from the current About copy. */
  positioning:
    "A leading exporter of premium teas from India to destinations across the globe.",
  url: "https://tejbidya.com",
  email: "info@tejbidya.com",
  phone: "+91 705 854 1284",
  phoneHref: "+917058541284",
  address: {
    line1: "Majestique City, Wing C1, 201",
    line2: "Opposite Lexicon School, Wagholi 412207",
    city: "Pune",
    region: "Maharashtra",
    country: "India",
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export const addressOneLine = [
  site.address.line1,
  site.address.line2,
  `${site.address.city}, ${site.address.region}`,
  site.address.country,
].join(", ");

/**
 * The three value propositions Tejbidya already states publicly.
 * Wording expanded for the new design, meaning unchanged.
 */
export const pillars = [
  {
    id: "quality",
    label: "Premium Quality",
    title: "Every batch, cupped before it ships",
    body:
      "Teas are sourced from trusted plantations held to rigorous standards, and each batch is tested for flavour, aroma and freshness before it leaves for export.",
  },
  {
    id: "reach",
    label: "Global Reach",
    title: "Built for international buyers",
    body:
      "We ship to destinations across the globe with a choice of freight methods, order tracking, and documentation handled as part of the process.",
  },
  {
    id: "sourcing",
    label: "Sustainable Sourcing",
    title: "Long relationships, not spot buys",
    body:
      "We work with growers we know and return to, so quality is consistent from one container to the next and the people who grow the leaf share in the value.",
  },
] as const;

/**
 * Export & logistics facts, all stated on the current FAQ page.
 */
export const exportFacts = {
  leadTime: "7–21 days",
  leadTimeNote: "after order confirmation, varying by destination",
  tracking: "Shipment tracking provided on every order",
  samples: "Samples available on request before any bulk commitment",
  privateLabel: "Custom packaging available for your own brand",
  qc: "Each batch tested for flavour, aroma and freshness prior to export",
} as const;

export const faqs = [
  {
    q: "What types of tea do you export?",
    a: "We export a wide variety of premium Indian teas, including Black Tea, Green Tea, White Tea, Oolong Tea and Masala Chai, alongside a range of flavoured blends. Each is sourced from premier Indian estates.",
  },
  {
    q: "What is the minimum order quantity?",
    a: "MOQ varies by product. For Black Tea and Masala Chai the MOQ is 100 kg; for Green Tea and Oolong Tea it is 50 kg. Please contact us for the MOQ on any other variety.",
  },
  {
    q: "How do you ensure the quality of your teas?",
    a: "We source from trusted plantations held to rigorous standards, and every batch is thoroughly tested for flavour, aroma and freshness before export to guarantee the highest quality.",
  },
  {
    q: "What are your shipping options and delivery times?",
    a: "Multiple shipping methods are available. Delivery times vary by region but generally range from 7 to 21 days after order confirmation. Shipment tracking is provided.",
  },
  {
    q: "Do you provide samples before a bulk order?",
    a: "Yes. We offer samples of our teas on request, so you can evaluate the product properly before committing to a bulk order.",
  },
  {
    q: "Can you assist with custom packaging for our brand?",
    a: "Yes. We offer custom packaging solutions to help you present your tea products attractively under your own label.",
  },
] as const;
