/**
 * IMAGE LIBRARY
 * ----------------------------------------------------------------------------
 * Every photograph on the site is referenced from this one file, so replacing
 * the stock imagery with Tejbidya's own photography is a single-file change.
 *
 * CURRENT SOURCE — Pexels CDN. The Pexels licence permits free commercial use
 * with no attribution required, which makes it safe as a launch placeholder.
 *
 * TO SWAP IN REAL PHOTOGRAPHY
 *   1. Drop files into /public/img/  (e.g. /public/img/hero.jpg)
 *   2. Change the `src` below to "/img/hero.jpg"
 *   3. Delete the images.remotePatterns entry in next.config.ts once no
 *      remote images remain.
 * No component needs to change.
 *
 * Every entry carries its own `alt` text — these are descriptions of the stock
 * photograph, NOT claims that the scene depicts a Tejbidya estate or facility.
 *
 * ART DIRECTION. Product photography is warm, still and close: brewed liquor in
 * glass or porcelain, or dry leaf on a plain ground. Landscape and process
 * photography is reserved for editorial sections. Frames with cold casts, loud
 * props or documentary street scenes are deliberately absent — mixing those with
 * still life is what makes a stock-photo site read as a template.
 *
 * Every alt here has been checked against the image it actually returns. Nine
 * entries were removed and eight alts corrected in the redesign because the CDN's
 * photographs had drifted from the descriptions written for them.
 */

export type Img = { src: string; alt: string };

/** Build a Pexels CDN URL at a given width. */
const px = (id: number, w = 1600): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const img = (id: number, alt: string, w?: number): Img => ({ src: px(id, w), alt });

export const images = {
  /* ---------- Landscape & atmosphere ---------- */
  hero: img(11669960, "Terraced tea hills with a pale track winding between the rows", 2000),
  hillsMisty: img(11669659, "Rolling tea-covered hills fading into morning mist"),
  hillsSoft: img(11669665, "Soft green tea hills beneath an open, hazy sky"),
  hillsDeep: img(13664689, "A steep hillside densely planted with tea, in deep green"),
  avenue: img(19102359, "An avenue of tall bare shade trees running through a tea garden"),
  slopes: img(103875, "Green tea slopes with a footpath cutting across the contours"),
  aerialRows: img(13760478, "Aerial view of neatly spaced tea bushes in long curving rows"),
  gardenEdge: img(16886315, "Tea bushes in the foreground with dense forest behind"),
  gardenTree: img(16325662, "A single golden tree standing in a wide field of tea"),

  /* ---------- Leaf ---------- */
  leafMacro: img(11669658, "Close-up of two bright new tea leaves and a bud on the bush"),
  leafMountain: img(11669662, "New tea shoots in focus with blurred mountains behind"),
  leafSoft: img(16578534, "Soft-focus close-up of fresh green tea foliage"),
  leafInHands: img(10365503, "Cupped hands holding freshly plucked tea leaves above the bushes"),
  leafBranch: img(2036874, "A hand picking a leaf from a mature tea branch"),

  /* ---------- People & harvest ---------- */
  pluckerPortrait: img(15275064, "A tea plucker in a wide conical hat smiling among the bushes"),
  pluckerField: img(15275097, "Several pluckers working a row of tea with baskets on their backs"),
  pluckerBasket: img(11586145, "A tea plucker carrying a woven collection basket"),

  /* ---------- Processing ---------- */
  withering: img(32379808, "Inside a tea factory, racks running the length of the floor"),
  sorting: img(31756539, "A hand spreading fresh green leaf across a sorting table"),
  factoryHall: img(32379813, "A worker carrying a full sack down a tea factory hall"),
  factoryLeaf: img(32379820, "A worker inspecting leaf beside a factory window"),

  /* ---------- Product & still life ---------- */
  blackLeafWhite: img(17751258, "Dark, tightly rolled black tea leaves on a white surface"),
  infuser: img(227908, "An open steel infuser ball with loose leaf on dark wood"),

  cupOolong: img(12338992, "A pale porcelain cup of amber liquor beside an unglazed clay teapot"),
  cupWhite: img(16485169, "A white porcelain bowl of loose green tea leaves on a bamboo mat"),

  chaiSpices: img(18503641, "Cinnamon bark on a warm-toned surface"),
  chaiMug: img(11833310, "A ceramic mug of milky tea with a cinnamon stick"),

  cuppingTray: img(1281150, "A tray of small tasting cups, steam rising from each"),
  camellia: img(25811335, "Pale pink roses against a dark background"),

  glassBacklit: img(17512812, "A clear glass mug of black tea lit from behind"),
  glassDark: img(15900978, "A small glass of dark tea on a saucer against a black ground"),
  glassSteam: img(1493080, "A tulip glass of tea with steam rising in low light"),
  glassHeld: img(28617425, "A hand lifting a small glass of amber tea into warm light"),
  valleyPour: img(18617044, "Tea being poured from a copper pot into a glass, a green valley beyond"),
} as const;

export type ImageKey = keyof typeof images;

/**
 * A tiny neutral blur placeholder. Using one shared value (rather than a real
 * per-image blurhash) keeps the payload small; every photo fades up from the
 * same warm cream tone, which suits the palette.
 */
export const BLUR =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 6"><rect width="8" height="6" fill="#E6DFD0"/></svg>`
  ).toString("base64");
