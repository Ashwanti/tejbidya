import { images, type Img } from "./images";

/**
 * PRODUCT DATA
 * ----------------------------------------------------------------------------
 * VERIFIED from tejbidya.com: the product range (Black, Green, White, Oolong,
 * Masala Chai plus flavoured blends) and the MOQ figures stated on the FAQ.
 *
 * NOT VERIFIED — and therefore explicitly flagged in the UI:
 *   — `profile`  — the flavour/body/briskness values are TYPICAL OF THE TEA
 *     CATEGORY, not measured values for Tejbidya's own lots. Every product page
 *     renders these under an "indicative" notice so no buyer mistakes them for
 *     a specification. Replace with real cupping scores when available.
 *   — `typicalOrigin` — the regions where this tea type is grown in India
 *     GENERALLY. Tejbidya's actual sourcing gardens are unknown, so the UI
 *     labels this "typical Indian origin", never "our estate".
 *   — Grades, harvest dates and lab specs are omitted rather than invented.
 *
 * Brewing guidance is standard, widely published preparation advice for each
 * tea type. It is presented as a general guide, which is what it is.
 */

export type Profile = {
  /** 0–5 on each axis. Category-typical, not measured. */
  body: number;
  briskness: number;
  astringency: number;
  aroma: number;
  sweetness: number;
};

export type Tea = {
  slug: string;
  name: string;
  category: "Black" | "Green" | "White" | "Oolong" | "Chai" | "Flavoured";
  /** Starting wholesale price per kg used in the shopping flow. */
  price: number;
  /** One-line positioning used on cards. */
  tagline: string;
  /** Longer editorial introduction. */
  intro: string;
  /** Descriptive tasting language — category-typical, flagged in the UI. */
  cup: string;
  aroma: string;
  strengthLabel: "Delicate" | "Light" | "Medium" | "Full" | "Robust";
  /** 1–5, used for the strength meter. */
  strength: number;
  profile: Profile;
  /** Flavour descriptors shown as small-caps chips. */
  notes: string[];
  /** Regions in India where this type is typically grown. Not a sourcing claim. */
  typicalOrigin: string[];
  /** Verified MOQ where stated on the FAQ; null means "contact us". */
  moqKg: number | null;
  /**
   * Brewing guidance. Every field is a short, scannable value in a consistent
   * unit so the spec row compares cleanly across products; the prose belongs in
   * `tip`. Leaf is grams per 200 ml cup.
   */
  brewing: {
    leaf: string;
    water: string;
    time: string;
    ratio: string;
    tip: string;
  };
  hero: Img;
  still: Img;
};

export const teas: Tea[] = [
  {
    slug: "black-tea",
    name: "Black Tea",
    category: "Black",
    price: 18,
    tagline: "Full-bodied, brisk and dependable — the backbone of any range.",
    intro:
      "Fully oxidised leaf that brews dark, strong and coppery. It is the tea most Western buyers build a range around: it takes milk without collapsing, it holds its shape in a blend, and it travels well. Available as loose leaf for premium retail lines and in grades suited to blending and bagging.",
    cup: "Deep amber-to-red in the cup, with a malty weight and a clean, brisk finish.",
    aroma: "Warm and malty, with a dry woody edge as the leaf opens.",
    strengthLabel: "Full",
    strength: 5,
    profile: { body: 5, briskness: 5, astringency: 4, aroma: 4, sweetness: 2 },
    notes: ["Malt", "Amber", "Brisk", "Woody", "Full-bodied"],
    typicalOrigin: ["Assam", "Darjeeling", "Nilgiris"],
    moqKg: 100,
    brewing: {
      leaf: "2–3 g",
      water: "95–100°C",
      time: "3–5 min",
      ratio: "2.5 g / 200 ml",
      tip: "Use water at a full rolling boil. Takes milk well; for iced tea, brew at double strength and pour straight over ice.",
    },
    hero: images.glassBacklit,
    still: images.infuser,
  },
  {
    slug: "green-tea",
    name: "Green Tea",
    category: "Green",
    price: 20,
    tagline: "Unoxidised, fresh and vegetal — light in the cup, clean on the finish.",
    intro:
      "Leaf that is heated soon after plucking to halt oxidation, keeping it green and fresh-tasting. Lighter and more delicate than black tea, with a grassy, sometimes nutty character. This is the category Western wellness and speciality buyers ask for most often.",
    cup: "Pale green-gold, light in body, with a fresh vegetal sweetness and no heaviness.",
    aroma: "Grassy and green, with a soft nutty warmth behind it.",
    strengthLabel: "Light",
    strength: 2,
    profile: { body: 2, briskness: 3, astringency: 2, aroma: 4, sweetness: 3 },
    notes: ["Grassy", "Fresh", "Nutty", "Clean", "Light"],
    typicalOrigin: ["Darjeeling", "Nilgiris", "Kangra"],
    moqKg: 50,
    brewing: {
      leaf: "2 g",
      water: "75–80°C",
      time: "2–3 min",
      ratio: "2 g / 200 ml",
      tip: "Never boiling — water that is too hot turns green tea bitter. Let the kettle stand a few minutes off the boil.",
    },
    hero: images.leafSoft,
    still: images.leafMacro,
  },
  {
    slug: "white-tea",
    name: "White Tea",
    category: "White",
    price: 26,
    tagline: "The least handled of all teas — buds, air and time.",
    intro:
      "Made from young buds and the youngest leaves, simply withered and dried with minimal intervention. Because so little is done to it, white tea carries the character of the leaf itself. It is the most delicate tier of a range and typically the highest positioned at retail.",
    cup: "Very pale, almost colourless, with a soft sweetness and a long, quiet finish.",
    aroma: "Faint and floral, with a hint of hay and honey.",
    strengthLabel: "Delicate",
    strength: 1,
    profile: { body: 1, briskness: 1, astringency: 1, aroma: 5, sweetness: 4 },
    notes: ["Floral", "Honeyed", "Silky", "Subtle", "Delicate"],
    typicalOrigin: ["Darjeeling", "Nilgiris"],
    moqKg: null,
    brewing: {
      leaf: "2–3 g",
      water: "70–80°C",
      time: "4–6 min",
      ratio: "2.5 g / 200 ml",
      tip: "Weigh rather than spoon it — white tea is very light by volume. Give it longer than you think; it rewards patience and will not easily turn bitter.",
    },
    hero: images.cupWhite,
    still: images.cuppingTray,
  },
  {
    slug: "oolong-tea",
    name: "Oolong Tea",
    category: "Oolong",
    price: 24,
    tagline: "Partly oxidised — the ground between green and black.",
    intro:
      "Oxidised to somewhere between a green and a black tea, which gives it unusual range: floral and light at one end, toasty and rich at the other. A category that signals expertise on a retail shelf and gives a range its centre of gravity.",
    cup: "Golden to deep amber depending on oxidation, rounded in body, with a lingering sweetness.",
    aroma: "Floral and stone-fruited, deepening towards toasted and creamy.",
    strengthLabel: "Medium",
    strength: 3,
    profile: { body: 3, briskness: 3, astringency: 2, aroma: 5, sweetness: 4 },
    notes: ["Floral", "Orchid", "Stone fruit", "Toasty", "Rounded"],
    typicalOrigin: ["Darjeeling", "Nilgiris"],
    moqKg: 50,
    brewing: {
      leaf: "3 g",
      water: "85–95°C",
      time: "3–5 min",
      ratio: "3 g / 200 ml",
      tip: "Good oolong will take several infusions. Re-steep the same leaf and the character shifts each time.",
    },
    hero: images.cupOolong,
    still: images.glassSteam,
  },
  {
    slug: "masala-chai",
    name: "Masala Chai",
    category: "Chai",
    price: 16,
    tagline: "Black tea and whole spices — built to be brewed with milk.",
    intro:
      "Strong black tea blended with warming whole spices, made to be brewed with milk. It is the most recognisable Indian tea in Western markets and the easiest entry point for a cafe programme or a retail chai line. Spice ratios can be adjusted to a buyer's own specification.",
    cup: "Dark and full, sweet-spiced, and built to carry milk without thinning out.",
    aroma: "Cardamom, ginger and cinnamon over a malty black tea base.",
    strengthLabel: "Robust",
    strength: 5,
    profile: { body: 5, briskness: 4, astringency: 3, aroma: 5, sweetness: 3 },
    notes: ["Cardamom", "Ginger", "Cinnamon", "Warming", "Robust"],
    typicalOrigin: ["Assam"],
    moqKg: 100,
    brewing: {
      leaf: "3–4 g",
      water: "Boil, then milk",
      time: "5 min simmer",
      ratio: "2:1 water to milk",
      tip: "Simmer leaf and spice in water first, add milk, then bring back to the boil once. Sweeten to taste.",
    },
    hero: images.chaiMug,
    still: images.chaiSpices,
  },
  {
    slug: "flavoured-blends",
    name: "Flavoured Blends",
    category: "Flavoured",
    price: 22,
    tagline: "A base tea, reworked — for private label and seasonal ranges.",
    intro:
      "Blends built on a base tea and finished with fruit, flower or botanical character. This is where most private-label programmes begin, because a blend can be developed to a buyer's brief and adjusted before any commitment. Tejbidya's existing range includes rose, vanilla, chocolate and paan among others.",
    cup: "Varies by blend — the base tea sets the body, the botanicals set the top note.",
    aroma: "Led by the botanical: floral, sweet or fruit-forward over the base leaf.",
    strengthLabel: "Medium",
    strength: 3,
    profile: { body: 3, briskness: 3, astringency: 2, aroma: 5, sweetness: 4 },
    notes: ["Rose", "Vanilla", "Chocolate", "Paan", "Custom"],
    typicalOrigin: ["Assam", "Nilgiris"],
    moqKg: null,
    brewing: {
      leaf: "2–3 g",
      water: "80–95°C",
      time: "3–4 min",
      ratio: "2.5 g / 200 ml",
      tip: "Follow the base tea — 95°C for a black base, 80°C for green. Brief steeps keep the botanicals bright; over-steeping flattens the aroma.",
    },
    hero: images.blackLeafWhite,
    still: images.camellia,
  },
];

export const getTea = (slug: string): Tea | undefined =>
  teas.find((t) => t.slug === slug);

export const PROFILE_AXES: { key: keyof Profile; label: string; hint: string }[] = [
  { key: "body", label: "Body", hint: "How much weight the tea carries in the mouth" },
  { key: "briskness", label: "Briskness", hint: "The lively, refreshing bite of the cup" },
  { key: "astringency", label: "Astringency", hint: "The drying grip left on the palate" },
  { key: "aroma", label: "Aroma", hint: "Intensity of scent in the dry leaf and the cup" },
  { key: "sweetness", label: "Sweetness", hint: "Natural sweetness, before anything is added" },
];

/**
 * Packaging formats offered to export buyers. These are generic trade formats
 * plus the custom packaging Tejbidya states it provides on its FAQ — not a
 * claim about specific in-house machinery.
 */
export const PACKAGING = [
  { name: "Bulk sacks", detail: "Multi-wall paper sacks with food-grade liner", use: "Blending and repacking" },
  { name: "Foil-lined cartons", detail: "Barrier carton for longer shelf stability", use: "Wholesale distribution" },
  { name: "Retail pouches", detail: "Stand-up pouch, resealable", use: "Shelf-ready retail" },
  { name: "Tins and caddies", detail: "Rigid pack for premium positioning", use: "Gifting and speciality" },
  { name: "Tea bags", detail: "Single-chamber or pyramid format", use: "Foodservice and grocery" },
  { name: "Private label", detail: "Your artwork, your brand", use: "Own-brand programmes" },
] as const;
