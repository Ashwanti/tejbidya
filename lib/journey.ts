import { images, type Img } from "./images";

/**
 * PRODUCTION STAGES — "Garden to cup"
 * ----------------------------------------------------------------------------
 * Lifted out of the TeaJourney component so the homepage summary and the full
 * /journey walkthrough read from one source. The previous build described the
 * same six stages in two places, which is exactly how stage names drift apart.
 *
 * HONESTY NOTE: this describes how tea is made, generally — standard, publicly
 * documented practice. It is NOT a description of Tejbidya's own facilities,
 * which we have no verified information about. The three Tejbidya-specific
 * claims included (batch testing, custom packaging, lead time and tracking) are
 * stated on their own site and are attributed to them where they appear.
 */

export type Stage = {
  n: string;
  key: string;
  title: string;
  sub: string;
  /** One line, used in the homepage summary. */
  summary: string;
  /** Full paragraph, used on /journey. */
  body: string;
  detail: { label: string; value: string }[];
  img: Img;
};

export const STAGES: Stage[] = [
  {
    n: "01",
    key: "garden",
    title: "The garden",
    sub: "Where the leaf begins",
    summary: "Altitude, soil and mist decide more about the cup than anything that follows.",
    body:
      "Every tea in the world comes from one plant — Camellia sinensis. What separates one tea from another is where it grows: the altitude, the soil, how much mist sits in the valley and how cold the nights get. A bush takes three to five years before it yields properly, and can then be plucked for decades.",
    detail: [
      { label: "Plant", value: "Camellia sinensis" },
      { label: "First harvest", value: "3–5 years from planting" },
      { label: "Productive life", value: "Several decades" },
    ],
    img: images.hillsMisty,
  },
  {
    n: "02",
    key: "harvest",
    title: "The harvest",
    sub: "Two leaves and a bud",
    summary: "The finest standard takes only the bud and the two youngest leaves, by hand.",
    body:
      "The finest plucking standard takes only the terminal bud and the two youngest leaves beneath it — the tenderest growth, and the part richest in the compounds that become flavour. It is done by hand, because no machine can make that judgement, and a skilled plucker works the same bush again every seven to fourteen days.",
    detail: [
      { label: "Standard", value: "Two leaves and a bud" },
      { label: "Method", value: "Selective hand-plucking" },
      { label: "Cycle", value: "Every 7–14 days" },
    ],
    img: images.leafInHands,
  },
  {
    n: "03",
    key: "processing",
    title: "Processing",
    sub: "Wither, roll, oxidise, fire",
    summary: "How far oxidation is allowed to run is what names the tea.",
    body:
      "Freshly plucked leaf is withered to drive off moisture, then rolled to rupture its cells and start oxidation. How long that oxidation runs is what decides the tea's identity: halted almost immediately it stays green; taken partway it becomes oolong; carried to completion it becomes black. Firing then arrests everything and fixes the character.",
    detail: [
      { label: "Withering", value: "12–18 hours" },
      { label: "Oxidation", value: "None → partial → full" },
      { label: "Firing", value: "Halts oxidation, sets the cup" },
    ],
    img: images.withering,
  },
  {
    n: "04",
    key: "cupping",
    title: "Grading & cupping",
    sub: "Judged before it travels",
    summary: "Sorted by grade, then tasted to a fixed method so lots compare honestly.",
    body:
      "Processed leaf is sorted by size and appearance, then tasted. Cupping is done to a fixed method — a set weight of leaf, water off the boil, a timed steep — so that lots can be compared honestly against one another. Tejbidya states that each batch is tested for flavour, aroma and freshness before it is exported.",
    detail: [
      { label: "Sorting", value: "By leaf grade and size" },
      { label: "Assessment", value: "Dry leaf, liquor, infused leaf" },
      { label: "Tejbidya's stated check", value: "Flavour, aroma, freshness" },
    ],
    img: images.cuppingTray,
  },
  {
    n: "05",
    key: "packing",
    title: "Packing",
    sub: "Sealed against air and light",
    summary: "Lined sacks for bulk, barrier packs for retail — or your own artwork.",
    body:
      "Tea's enemies are moisture, light, heat and odour, and it will pick up all four given the chance. It is packed accordingly — lined sacks for bulk, barrier cartons and foil for longer-held stock, resealable pouches or tins where the pack goes straight to a shelf. Tejbidya offers custom packaging for buyers selling under their own brand.",
    detail: [
      { label: "Bulk", value: "Lined multi-wall sacks" },
      { label: "Retail", value: "Pouches, tins, cartons, bags" },
      { label: "Private label", value: "Offered — your artwork" },
    ],
    img: images.factoryHall,
  },
  {
    n: "06",
    key: "export",
    title: "Export",
    sub: "Shipped, tracked, delivered",
    summary: "Freight to suit the volume, documentation prepared, tracking on every order.",
    body:
      "Orders move by the freight method that suits the volume and the deadline, with documentation prepared for the destination. Tejbidya states that delivery generally runs 7 to 21 days from order confirmation depending on the region, and that shipment tracking is provided on every order.",
    detail: [
      { label: "Lead time", value: "7–21 days from confirmation" },
      { label: "Tracking", value: "Provided on every order" },
      { label: "Before you commit", value: "Samples on request" },
    ],
    img: images.valleyPour,
  },
];
