/**
 * INDIA'S TEA-GROWING REGIONS
 * ----------------------------------------------------------------------------
 * This is EDUCATIONAL content about where tea is grown in India. It is general,
 * publicly established geography and horticulture — altitudes, terrain, harvest
 * seasons and the characteristic cup of each region.
 *
 * IMPORTANT: nothing here asserts that Tejbidya sources from these regions or
 * operates any estate in them. The /origins page states this explicitly. When
 * the client confirms actual sourcing regions, mark them with `sourced: true`
 * and the UI will surface that distinction.
 */

/**
 * One picking window in the year.
 *
 * `from`/`to` are 1-based months, inclusive, and may wrap the year end
 * (the Nilgiri frost harvest runs Dec–Feb, i.e. from 12 to 2). Anything
 * reading these has to handle that wrap — see monthsOf().
 *
 * Every flush here is a structured restatement of the region's own `harvest`
 * line, nothing more. The two must not drift: the timeline and the prose are
 * describing the same fact, and a buyer will notice if they disagree.
 */
export type Flush = {
  name: string;
  from: number;
  to: number;
  /** The prized picking, where a region has one. */
  peak?: boolean;
  /** What this particular picking gives in the cup. */
  note: string;
};

export type Region = {
  id: string;
  name: string;
  state: string;
  /** Decimal degrees — used to place the map pin. */
  lat: number;
  lon: number;
  altitude: string;
  harvest: string;
  /** Structured form of `harvest`, for the timeline. */
  flushes: Flush[];
  terrain: string;
  /** The cup this region is known for. */
  character: string;
  blurb: string;
  /** Which of our tea types this region is classically associated with. */
  teas: string[];
  /**
   * Set to true ONLY when Tejbidya confirms it sources from this region.
   * Until then the UI presents every region as context, not provenance.
   */
  sourced: boolean;
};

export const regions: Region[] = [
  {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    lat: 27.04,
    lon: 88.26,
    altitude: "600–2,000 m",
    harvest: "First flush (Mar–Apr) · Second flush (May–Jun) · Autumnal (Oct–Nov)",
    flushes: [
      { name: "First flush", from: 3, to: 4, note: "Pale and floral, the year's most delicate picking" },
      { name: "Second flush", from: 5, to: 6, peak: true, note: "The muscatel harvest Darjeeling is known for" },
      { name: "Autumnal", from: 10, to: 11, note: "Rounder and darker after the rains" },
    ],
    terrain: "Steep Himalayan foothill slopes, cool and cloud-wrapped",
    character: "Light, aromatic, muscatel",
    blurb:
      "Grown on near-vertical Himalayan slopes where cold nights slow the bush and concentrate aromatics. The result is a pale, perfumed cup quite unlike any other black tea — the reason Darjeeling is spoken about in the language of wine rather than of commodity tea.",
    teas: ["Black", "Green", "White", "Oolong"],
    sourced: false,
  },
  {
    id: "assam",
    name: "Assam",
    state: "Assam",
    lat: 26.74,
    lon: 94.21,
    altitude: "50–120 m",
    harvest: "First flush (Mar–Apr) · Second flush (Jun–Sep)",
    flushes: [
      { name: "First flush", from: 3, to: 4, note: "Lighter and brisker than the tea Assam is known for" },
      { name: "Second flush", from: 6, to: 9, peak: true, note: "The malty, full-bodied harvest that carries milk and spice" },
    ],
    terrain: "Flat alluvial plain either side of the Brahmaputra river",
    character: "Malty, strong, deep amber",
    blurb:
      "A hot, humid river plain that produces the strongest and most full-bodied tea in India. Assam is the base of most breakfast blends in Britain and North America, and the tea that makes masala chai work — it has the body to carry milk and spice without disappearing.",
    teas: ["Black", "Chai"],
    sourced: false,
  },
  {
    id: "nilgiris",
    name: "The Nilgiris",
    state: "Tamil Nadu",
    lat: 11.41,
    lon: 76.7,
    altitude: "1,000–2,500 m",
    harvest: "Year-round, with a prized winter frost harvest (Dec–Feb)",
    flushes: [
      { name: "Main harvest", from: 1, to: 12, note: "Picked continuously — the hills never fully stop" },
      { name: "Frost harvest", from: 12, to: 2, peak: true, note: "Cold nights concentrate the leaf; the prized winter picking" },
    ],
    terrain: "The Blue Mountains of the southern Western Ghats",
    character: "Fragrant, brisk, clean",
    blurb:
      "The Blue Mountains of the south, where tea grows year-round on high, misty ridges. Nilgiri tea is notably clean and fragrant, and it stays clear rather than clouding when iced — which is why it is so widely used for iced tea programmes in the United States.",
    teas: ["Black", "Green", "White", "Oolong"],
    sourced: false,
  },
  {
    id: "munnar",
    name: "Munnar & the High Ranges",
    state: "Kerala",
    lat: 10.09,
    lon: 77.06,
    altitude: "1,300–2,000 m",
    harvest: "Year-round",
    flushes: [
      { name: "Year-round picking", from: 1, to: 12, note: "The high valleys stay green and in leaf all year" },
    ],
    terrain: "High valleys of the Western Ghats, heavy monsoon",
    character: "Bright, brisk, full colour",
    blurb:
      "Tea planted across the high valleys of the Western Ghats, where the monsoon arrives hard and the hills stay green all year. The cup is bright and brisk with strong colour, making it a dependable component in blends that need lift.",
    teas: ["Black", "Green"],
    sourced: false,
  },
  {
    id: "sikkim",
    name: "Sikkim",
    state: "Sikkim",
    lat: 27.33,
    lon: 88.61,
    altitude: "1,200–1,800 m",
    harvest: "Spring through autumn",
    flushes: [
      { name: "Spring to autumn", from: 3, to: 11, note: "A single long season across a very small planted area" },
    ],
    terrain: "Eastern Himalayan slopes, very small planted area",
    character: "Delicate, floral, Darjeeling-adjacent",
    blurb:
      "A tiny growing area in the eastern Himalaya with only a handful of gardens, sitting just north of Darjeeling and sharing much of its character. Volumes are small, which makes Sikkim tea a speciality proposition rather than a programme tea.",
    teas: ["Black", "Green", "White"],
    sourced: false,
  },
  {
    id: "kangra",
    name: "Kangra Valley",
    state: "Himachal Pradesh",
    lat: 32.1,
    lon: 76.27,
    altitude: "900–1,400 m",
    harvest: "Spring (Apr–May) · Summer (Jul–Aug)",
    flushes: [
      { name: "Spring", from: 4, to: 5, peak: true, note: "The light, sweet picking the valley is known for" },
      { name: "Summer", from: 7, to: 8, note: "A second, smaller picking after the early rains" },
    ],
    terrain: "Sub-Himalayan valley beneath the Dhauladhar range",
    character: "Light, sweet, subtly woody",
    blurb:
      "A small northern valley beneath the Dhauladhar range, growing tea since the nineteenth century in modest quantity. Kangra produces a light, sweet cup with a distinctive soft woodiness, and remains one of India's least-known growing areas.",
    teas: ["Black", "Green"],
    sourced: false,
  },
  {
    id: "dooars",
    name: "Dooars & Terai",
    state: "West Bengal",
    lat: 26.7,
    lon: 88.9,
    altitude: "90–500 m",
    harvest: "Mar–Nov",
    flushes: [
      { name: "Main season", from: 3, to: 11, note: "One long working season across the foothill belt" },
    ],
    terrain: "Flat foothill belt below the Darjeeling hills",
    character: "Bright, full, everyday strength",
    blurb:
      "The wide, flat belt lying below the Darjeeling hills, where the ground levels out into working plantations. Dooars and Terai teas give bright colour and honest strength, and they do the quiet work of holding commercial blends together.",
    teas: ["Black", "Chai"],
    sourced: false,
  },
];

/* ---------------------------------------------------------------------------
   HARVEST CALENDAR
   --------------------------------------------------------------------------- */

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * A flush as one or two continuous month spans.
 *
 * A window that wraps the year end (Dec–Feb) cannot be drawn as a single bar
 * on a Jan–Dec track, so it comes back split: Dec, then Jan–Feb. Callers draw
 * whatever they are given rather than reasoning about the wrap themselves.
 */
export function spansOf(flush: Flush): { from: number; to: number }[] {
  if (flush.from <= flush.to) return [{ from: flush.from, to: flush.to }];
  return [
    { from: flush.from, to: 12 },
    { from: 1, to: flush.to },
  ];
}

/** Every month a flush covers, wrap included. */
export function monthsOf(flush: Flush): number[] {
  return spansOf(flush).flatMap(({ from, to }) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)
  );
}

/** Is `month` (1-12) inside this flush? */
export function isFlushActive(flush: Flush, month: number): boolean {
  return monthsOf(flush).includes(month);
}

/** The flushes a region is picking in `month`, peak ones first. */
export function activeFlushes(region: Region, month: number): Flush[] {
  return region.flushes
    .filter((flush) => isFlushActive(flush, month))
    .sort((a, b) => Number(b.peak ?? false) - Number(a.peak ?? false));
}

/** Regions picking in `month`. Drives the "in season now" read-out. */
export function regionsInSeason(month: number): Region[] {
  return regions.filter((region) => activeFlushes(region, month).length > 0);
}

/* ---------------------------------------------------------------------------
   MAP PROJECTION
   A coarse outline of India, stored as [lon, lat] pairs and projected into SVG
   space at render time. Keeping the source as real coordinates means the pins
   (which are also real coordinates) land in the right place automatically.
   --------------------------------------------------------------------------- */

export const MAP = {
  width: 400,
  height: 460,
  lonMin: 67.0,
  lonMax: 98.0,
  latMin: 7.0,
  latMax: 37.5,
} as const;

/** Equirectangular projection, corrected for longitude convergence at ~23°N. */
export function project(lon: number, lat: number): { x: number; y: number } {
  const lonSpan = MAP.lonMax - MAP.lonMin;
  const latSpan = MAP.latMax - MAP.latMin;
  return {
    x: ((lon - MAP.lonMin) / lonSpan) * MAP.width,
    y: ((MAP.latMax - lat) / latSpan) * MAP.height,
  };
}

/**
 * National outline as [lon, lat] pairs, clockwise from the far north.
 * Coarse but shaped closely enough that the silhouette reads as India:
 * the Kashmir spur, the Gangetic plain, the narrow corridor east to the
 * north-eastern states, the eastern seaboard, the southern point at
 * Kanyakumari, the Konkan coast and the Kathiawar peninsula.
 */
const OUTLINE: [number, number][] = [
  // Northern frontier, west to east
  [76.9, 35.6], [77.8, 35.5], [78.3, 34.6], [78.9, 34.3], [79.3, 33.4],
  [79.1, 32.6], [78.7, 31.9], [79.1, 31.4], [80.2, 30.6], [80.9, 30.2],
  [81.9, 30.3], [82.7, 29.7], [83.8, 29.3], [84.6, 28.7], [85.8, 28.2],
  [87.0, 27.9], [88.1, 27.9], [88.2, 27.3], [88.7, 27.5], [88.9, 27.3],
  // North-east: the corridor and the far eastern states
  [89.1, 26.8], [89.8, 26.7], [90.7, 26.8], [91.6, 26.8], [92.1, 26.9],
  [92.6, 27.5], [93.4, 27.6], [94.3, 27.6], [95.2, 27.9], [95.9, 28.3],
  [96.6, 28.4], [97.1, 28.2], [97.4, 27.6], [96.9, 27.2], [96.2, 27.2],
  [95.5, 26.6], [95.1, 26.1], [94.6, 25.5], [94.5, 25.0], [94.3, 24.3],
  [94.1, 23.8], [93.5, 23.1], [93.2, 22.4], [92.9, 22.0], [92.6, 21.9],
  // Wrapping back around the Bangladesh border
  [92.3, 22.3], [92.1, 23.0], [91.6, 22.9], [91.4, 23.6], [91.2, 24.1],
  [92.0, 24.4], [92.4, 24.9], [92.2, 25.2], [91.5, 25.1], [90.5, 25.2],
  [89.8, 25.3], [89.6, 26.0], [88.9, 26.3], [88.4, 26.5], [88.1, 26.1],
  [88.7, 25.5], [88.2, 24.9], [88.0, 24.5], [88.7, 24.3], [88.9, 23.9],
  [88.6, 23.2], [89.0, 22.2], [88.9, 21.7],
  // East coast, north to south
  [87.5, 21.6], [87.0, 21.5], [86.5, 20.8], [86.9, 20.2], [85.8, 19.7],
  [85.0, 19.5], [84.0, 18.9], [83.0, 18.3], [82.3, 17.1], [81.2, 16.3],
  [80.9, 15.8], [80.2, 15.9], [80.3, 15.0], [80.1, 14.0], [80.2, 13.4],
  [80.0, 12.5], [79.9, 11.9], [79.8, 11.3], [79.5, 10.8], [79.9, 10.3],
  [79.3, 9.6], [78.9, 9.3], [79.1, 8.9], [78.5, 8.7], [78.1, 8.4],
  [77.5, 8.1],
  // West coast, south to north
  [77.0, 8.4], [76.6, 8.9], [76.3, 9.5], [76.0, 10.3], [75.7, 11.2],
  [75.4, 11.9], [74.8, 12.8], [74.7, 13.6], [74.3, 14.6], [73.9, 15.4],
  [73.5, 16.1], [73.3, 17.0], [73.0, 17.9], [72.8, 18.8], [72.9, 19.7],
  [72.7, 20.5], [72.9, 21.2], [72.6, 21.7],
  // Kathiawar peninsula and the Rann of Kutch
  [72.2, 21.7], [71.5, 21.0], [70.9, 20.8], [70.0, 21.0], [69.2, 21.7],
  [68.9, 22.3], [69.6, 22.5], [70.4, 22.8], [71.0, 22.7], [71.8, 22.4],
  [72.2, 22.7], [72.6, 23.1], [72.0, 23.4], [71.0, 23.7], [70.3, 23.8],
  [69.5, 23.9], [68.7, 23.9], [68.2, 23.7], [68.4, 24.3], [69.3, 24.3],
  [70.1, 24.6], [70.6, 25.7], [71.0, 26.5], [71.9, 27.7], [72.9, 28.0],
  // Punjab and the return to Kashmir
  [73.4, 28.5], [73.9, 29.0], [74.5, 29.9], [74.0, 30.4], [74.6, 31.1],
  [75.4, 32.1], [74.7, 32.5], [74.3, 32.8], [74.1, 33.4], [73.9, 34.1],
  [74.6, 34.7], [75.4, 35.0], [76.2, 35.5],
];

/** The India silhouette as an SVG path string. */
export const INDIA_PATH: string =
  OUTLINE.map(([lon, lat], i) => {
    const { x, y } = project(lon, lat);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
