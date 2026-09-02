/**
 * TEA FINDER ICONS
 * ----------------------------------------------------------------------------
 * One glyph per answer, drawn on the same 24-unit grid at the same stroke
 * weight so fifteen of them still read as one set.
 *
 * They exist because the finder previously repeated a single leaf mark beside
 * every option, which gave the eye nothing to tell four choices apart with.
 * Each mark is literal rather than decorative — a drop for milk, a cube for
 * iced — so it can be understood before the label is read.
 *
 * The three strength marks are deliberately the same figure at three weights:
 * strength is one axis, and drawing it as three unrelated pictures would hide
 * that the options are points on a scale.
 */

type IconName =
  | "cup"
  | "milk"
  | "ice"
  | "spectrum"
  | "weight-light"
  | "weight-mid"
  | "weight-full"
  | "blossom"
  | "sprig"
  | "grain"
  | "spice"
  | "shelf"
  | "service"
  | "tag"
  | "gem";

export type { IconName };

const GLYPHS: Record<IconName, React.ReactNode> = {
  /* --- How it is drunk ------------------------------------------------- */
  cup: (
    <>
      <path d="M4.8 8.5h10.7v4.7a5.35 5.35 0 0 1-10.7 0V8.5Z" />
      <path d="M15.5 9.6h1.7a2.45 2.45 0 0 1 0 4.9h-1.7" />
      <path d="M5.5 20.5h9.3" />
    </>
  ),
  milk: (
    <>
      <path d="M12 3.4c3.1 4.1 5.1 6.6 5.1 9a5.1 5.1 0 0 1-10.2 0c0-2.4 2-4.9 5.1-9Z" />
      <path d="M9.4 13.2a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  ice: (
    <>
      <path d="M12 3.2v17.6" />
      <path d="M4.4 7.6 19.6 16.4" />
      <path d="M19.6 7.6 4.4 16.4" />
      <path d="M12 3.2 9.8 5.6M12 3.2l2.2 2.4M12 20.8l-2.2-2.4M12 20.8l2.2-2.4" />
    </>
  ),
  spectrum: (
    <>
      <path d="M4.6 20V16.2" />
      <path d="M9.5 20v-7.6" />
      <path d="M14.5 20V8.6" />
      <path d="M19.4 20V4.8" />
    </>
  ),

  /* --- Strength: one figure, three weights ------------------------------ */
  "weight-light": (
    <>
      <path d="M4.5 12h15" strokeWidth={1} />
    </>
  ),
  "weight-mid": (
    <>
      <path d="M4.5 9.4h15" strokeWidth={1.7} />
      <path d="M4.5 14.6h15" strokeWidth={1.7} />
    </>
  ),
  "weight-full": (
    <>
      <path d="M4.5 7.4h15" strokeWidth={2.5} />
      <path d="M4.5 12h15" strokeWidth={2.5} />
      <path d="M4.5 16.6h15" strokeWidth={2.5} />
    </>
  ),

  /* --- Flavour ---------------------------------------------------------- */
  blossom: (
    <>
      {[0, 90, 180, 270].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 12 12)`}
          d="M12 12c0-3.3 1.9-5.2 4.7-5.2C16.7 10.1 14.8 12 12 12Z"
        />
      ))}
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  sprig: (
    <>
      <path d="M12 20.5c0-7 1.4-11 4.6-13.6" />
      <path d="M12 20.5c0-5.2-1.2-8.4-3.8-10.4" />
      <path d="M12 20.5v-3" />
    </>
  ),
  grain: (
    <>
      <path d="M12 20.5V7.2" />
      <path d="M12 7.2c0-2.2 1-3.7 2.6-4.4.5 1.8.1 3.5-2.6 4.4Z" />
      <path d="M12 12.4c1.9-.6 3.2-1.9 3.4-3.9-2 .2-3.2 1.5-3.4 3.9Z" />
      <path d="M12 12.4c-1.9-.6-3.2-1.9-3.4-3.9 2 .2 3.2 1.5 3.4 3.9Z" />
      <path d="M12 17.2c1.9-.6 3.2-1.9 3.4-3.9-2 .2-3.2 1.5-3.4 3.9Z" />
      <path d="M12 17.2c-1.9-.6-3.2-1.9-3.4-3.9 2 .2 3.2 1.5 3.4 3.9Z" />
    </>
  ),
  spice: (
    <>
      {[0, 45, 90, 135].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle} 12 12)`}
          d="M12 3.6c1.3 2.4 1.9 4.5 1.9 6.2 0 1.5-.8 2.4-1.9 2.4s-1.9-.9-1.9-2.4c0-1.7.6-3.8 1.9-6.2Z"
        />
      ))}
    </>
  ),

  /* --- What it is for --------------------------------------------------- */
  shelf: (
    <>
      <path d="M3.6 4.8h16.8v5.4H3.6z" />
      <path d="M3.6 13.8h16.8v5.4H3.6z" />
      <path d="M9.2 4.8v5.4M14.8 13.8v5.4" />
    </>
  ),
  service: (
    <>
      <path d="M4.6 11.4h11v3.4a5.5 5.5 0 0 1-11 0v-3.4Z" />
      <path d="M15.6 12.3h1.5a2.2 2.2 0 0 1 0 4.4h-1.5" />
      <path d="M8 8.2c0-1.4 1.6-1.4 1.6-2.8M12.2 8.2c0-1.4 1.6-1.4 1.6-2.8" />
      <path d="M4 20.6h12.6" />
    </>
  ),
  tag: (
    <>
      <path d="M11.3 3.8H20v8.7l-8.2 8.2a1.6 1.6 0 0 1-2.3 0l-6.4-6.4a1.6 1.6 0 0 1 0-2.3l8.2-8.2Z" />
      <circle cx="16.2" cy="7.6" r="1.5" />
    </>
  ),
  gem: (
    <>
      <path d="M7.4 3.8h9.2l3.6 5.1L12 20.4 3.8 8.9l3.6-5.1Z" />
      <path d="M3.8 8.9h16.4" />
      <path d="M9.6 8.9 12 20.4l2.4-11.5" />
      <path d="m7.4 3.8 2.2 5.1M16.6 3.8l-2.2 5.1" />
    </>
  ),
};

export default function FinderIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {GLYPHS[name]}
    </svg>
  );
}
